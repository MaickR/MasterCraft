/**
 * MasterCraft Contact Form Server
 * Handles form submissions and saves leads to Excel file
 * Enhanced with rate limiting and security features
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting storage (simple in-memory)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

// Clean up old rate limit entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimitStore.entries()) {
        if (now - data.windowStart > RATE_LIMIT_WINDOW * 2) {
            rateLimitStore.delete(ip);
        }
    }
}, 5 * 60 * 1000);

// Rate limiting middleware
function rateLimiter(req, res, next) {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    if (!rateLimitStore.has(clientIp)) {
        rateLimitStore.set(clientIp, {
            count: 1,
            windowStart: now
        });
        return next();
    }
    
    const clientData = rateLimitStore.get(clientIp);
    
    // Reset window if expired
    if (now - clientData.windowStart > RATE_LIMIT_WINDOW) {
        rateLimitStore.set(clientIp, {
            count: 1,
            windowStart: now
        });
        return next();
    }
    
    // Check if limit exceeded
    if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
        const retryAfter = Math.ceil((RATE_LIMIT_WINDOW - (now - clientData.windowStart)) / 1000);
        res.set('Retry-After', retryAfter);
        return res.status(429).json({
            success: false,
            message: `Demasiadas solicitudes. Por favor espere ${retryAfter} segundos.`,
            retryAfter: retryAfter
        });
    }
    
    // Increment counter
    clientData.count++;
    next();
}

// Sanitize input to prevent XSS
function sanitizeInput(value, maxLength = 500) {
    if (!value) return '';
    return String(value)
        .trim()
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[<>]/g, '') // Remove < and >
        .substring(0, maxLength);
}

// CORS configuration - restrict to same origin in production
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (same-origin requests)
        if (!origin) return callback(null, true);
        // In production, you would restrict this to your domain
        callback(null, true);
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    maxAge: 86400 // Cache preflight for 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Security headers
app.use((req, res, next) => {
    res.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
    });
    next();
});

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// Leads Excel file path
const LEADS_FILE = path.join(__dirname, '..', 'leads', 'contacts.xlsx');

// Ensure leads directory exists
const leadsDir = path.join(__dirname, '..', 'leads');
if (!fs.existsSync(leadsDir)) {
    fs.mkdirSync(leadsDir, { recursive: true });
}

// Initialize Excel file if it doesn't exist
function initializeExcelFile() {
    if (!fs.existsSync(LEADS_FILE)) {
        const workbook = XLSX.utils.book_new();
        const headers = [
            'Fecha',
            'Hora',
            'Nombre',
            'Empresa',
            'Email',
            'Teléfono',
            'Servicio',
            'Mensaje',
            'IP',
            'User Agent'
        ];
        const worksheet = XLSX.utils.aoa_to_sheet([headers]);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
        XLSX.writeFile(workbook, LEADS_FILE);
        console.log('✓ Excel file created:', LEADS_FILE);
    }
}

// Validate form data
function validateFormData(data) {
    const errors = [];
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        errors.push('El nombre es requerido (mínimo 2 caracteres)');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Por favor ingrese un email válido');
    }
    
    // Phone validation
    const phoneRegex = /^[0-9]{7,15}$/;
    const cleanPhone = (data.phone || '').replace(/[\s\-\(\)]/g, '');
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
        errors.push('Por favor ingrese un teléfono válido (7-15 dígitos)');
    }
    
    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        errors.push('El mensaje es requerido (mínimo 10 caracteres)');
    }
    
    return errors;
}

// Save lead to Excel
function saveLeadToExcel(leadData) {
    try {
        // Read existing workbook or create new one
        let workbook;
        if (fs.existsSync(LEADS_FILE)) {
            workbook = XLSX.readFile(LEADS_FILE);
        } else {
            initializeExcelFile();
            workbook = XLSX.readFile(LEADS_FILE);
        }
        
        const worksheet = workbook.Sheets['Leads'];
        const existingData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Add new row
        const now = new Date();
        const newRow = [
            now.toLocaleDateString('es-CO'),
            now.toLocaleTimeString('es-CO'),
            leadData.name || '',
            leadData.company || '',
            leadData.email || '',
            leadData.phone || '',
            leadData.service || '',
            leadData.message || '',
            leadData.ip || '',
            leadData.userAgent || ''
        ];
        
        existingData.push(newRow);
        
        // Create new worksheet with updated data
        const newWorksheet = XLSX.utils.aoa_to_sheet(existingData);
        
        // Set column widths
        newWorksheet['!cols'] = [
            { wch: 12 },  // Fecha
            { wch: 10 },  // Hora
            { wch: 25 },  // Nombre
            { wch: 25 },  // Empresa
            { wch: 30 },  // Email
            { wch: 15 },  // Teléfono
            { wch: 20 },  // Servicio
            { wch: 50 },  // Mensaje
            { wch: 15 },  // IP
            { wch: 30 }   // User Agent
        ];
        
        workbook.Sheets['Leads'] = newWorksheet;
        XLSX.writeFile(workbook, LEADS_FILE);
        
        return true;
    } catch (error) {
        console.error('Error saving to Excel:', error);
        return false;
    }
}

// API endpoint for contact form (with rate limiting)
app.post('/api/contact', rateLimiter, (req, res) => {
    console.log('📧 New contact form submission received');
    
    // Honeypot check - if 'website' field is filled, it's likely a bot
    if (req.body.website && req.body.website.length > 0) {
        console.log('🤖 Bot detected via honeypot');
        // Return success to not alert the bot
        return res.json({
            success: true,
            message: '¡Gracias! Su mensaje ha sido enviado.'
        });
    }
    
    const formData = {
        name: sanitizeInput(req.body.name, 100),
        company: sanitizeInput(req.body.company, 100),
        email: sanitizeInput(req.body.email, 254),
        phone: sanitizeInput(req.body.phone, 20),
        service: sanitizeInput(req.body.service, 50),
        message: sanitizeInput(req.body.message, 2000),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: sanitizeInput(req.get('User-Agent'), 200) || ''
    };
    
    // Validate
    const errors = validateFormData(formData);
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors
        });
    }
    
    // Save to Excel
    const saved = saveLeadToExcel(formData);
    
    if (saved) {
        console.log('✓ Lead saved successfully:', formData.name, formData.email);
        return res.json({
            success: true,
            message: '¡Gracias por contactarnos! Nos comunicaremos con usted pronto.'
        });
    } else {
        return res.status(500).json({
            success: false,
            message: 'Error al procesar su solicitud. Por favor intente nuevamente.'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize and start server
initializeExcelFile();

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════╗
║   MasterCraft Server Running                   ║
║   http://localhost:${PORT}                        ║
╠════════════════════════════════════════════════╣
║   Endpoints:                                   ║
║   • POST /api/contact - Submit contact form    ║
║   • GET  /api/health  - Server health check    ║
╚════════════════════════════════════════════════╝
    `);
});
