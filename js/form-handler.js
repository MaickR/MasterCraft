/**
 * MasterCraft Contact Form Handler
 * Frontend validation + server submission with Excel export
 * Enhanced Security: Rate limiting, honeypot, input sanitization
 */
(function($) {
    'use strict';
    
    // Configuration
    var CONFIG = {
        serverUrl: 'http://localhost:3000/api/contact',
        whatsappNumber: '573013938723',
        minNameLength: 2,
        minMessageLength: 10,
        maxMessageLength: 5000,
        rateLimitMs: 30000, // 30 seconds between submissions
        maxSubmissionsPerHour: 5
    };
    
    // Rate limiting storage
    var submissionHistory = [];
    var lastSubmissionTime = 0;
    
    $(document).ready(function() {
        var $form = $('#contactForm');
        var $feedback = $('#formFeedback');
        var $submitBtn = $form.find('button[type="submit"]');
        var originalBtnText = $submitBtn.html();
        
        // Add honeypot field for bot detection
        addHoneypot($form);
        
        // Form submission
        $form.on('submit', function(e) {
            e.preventDefault();
            
            // Clear previous feedback
            hideFeedback();
            
            // Check honeypot (bot detection)
            if (checkHoneypot($form)) {
                console.warn('Bot detected via honeypot');
                showFeedback('Error al enviar. Por favor intente más tarde.', 'error');
                return;
            }
            
            // Rate limiting check
            var rateLimitCheck = checkRateLimit();
            if (!rateLimitCheck.allowed) {
                showFeedback(rateLimitCheck.message, 'error');
                return;
            }
            
            // Collect and sanitize form data
            var formData = {
                name: sanitizeInput($('#name').val()),
                company: sanitizeInput($('#company').val()),
                email: sanitizeEmail($('#email').val()),
                phone: sanitizePhone($('#phone').val()),
                service: $('#service').val() || '',
                message: sanitizeInput($('#message').val(), CONFIG.maxMessageLength),
                _timestamp: Date.now(),
                _timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };
            
            // Validate
            var errors = validateForm(formData);
            if (errors.length > 0) {
                showFeedback(errors.join('<br>'), 'error');
                highlightErrors(errors);
                return;
            }
            
            // Record submission for rate limiting
            recordSubmission();
            
            // Disable button and show loading
            setLoading(true);
            
            // Submit to server
            submitToServer(formData)
                .then(function(response) {
                    if (response.success) {
                        showFeedback(response.message, 'success');
                        $form[0].reset();
                        
                        // Scroll to feedback
                        $('html, body').animate({
                            scrollTop: $feedback.offset().top - 100
                        }, 500);

                        // Open WhatsApp with the message
                        var waMessage = "Hola, soy " + formData.name + ". " +
                                      (formData.company ? "De la empresa " + formData.company + ". " : "") +
                                      "Me interesa: " + formData.service + ". " +
                                      "Mensaje: " + formData.message;
                        var waUrl = "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(waMessage);
                        window.open(waUrl, '_blank');

                    } else {
                        var errorMsg = response.errors ? response.errors.join('<br>') : response.message;
                        showFeedback(errorMsg, 'error');
                    }
                })
                .catch(function(error) {
                    console.error('Form submission error:', error);
                    showFeedback(
                        'Error al enviar el formulario. Por favor intente nuevamente o contáctenos por ' +
                        '<a href="https://wa.me/' + CONFIG.whatsappNumber + '" target="_blank">WhatsApp</a>.',
                        'error'
                    );
                })
                .finally(function() {
                    setLoading(false);
                });
        });
        
        // Real-time validation on blur
        $form.find('input, textarea').on('blur', function() {
            var $field = $(this);
            validateField($field);
        });
        
        // Remove error state on focus
        $form.find('input, textarea, select').on('focus', function() {
            $(this).removeClass('is-invalid');
        });
        
        /**
         * Add honeypot field for bot detection
         */
        function addHoneypot($form) {
            var honeypot = $('<div style="position:absolute;left:-9999px;top:-9999px;opacity:0;height:0;overflow:hidden;">' +
                '<input type="text" name="website" id="website" tabindex="-1" autocomplete="off">' +
                '</div>');
            $form.append(honeypot);
        }
        
        /**
         * Check if honeypot was filled (bot detected)
         */
        function checkHoneypot($form) {
            var honeypotValue = $form.find('#website').val();
            return honeypotValue && honeypotValue.length > 0;
        }
        
        /**
         * Check rate limiting
         */
        function checkRateLimit() {
            var now = Date.now();
            
            // Check minimum time between submissions
            if (now - lastSubmissionTime < CONFIG.rateLimitMs) {
                var waitSeconds = Math.ceil((CONFIG.rateLimitMs - (now - lastSubmissionTime)) / 1000);
                return {
                    allowed: false,
                    message: 'Por favor espere ' + waitSeconds + ' segundos antes de enviar otro mensaje.'
                };
            }
            
            // Check max submissions per hour
            var oneHourAgo = now - (60 * 60 * 1000);
            submissionHistory = submissionHistory.filter(function(time) {
                return time > oneHourAgo;
            });
            
            if (submissionHistory.length >= CONFIG.maxSubmissionsPerHour) {
                return {
                    allowed: false,
                    message: 'Ha alcanzado el límite de envíos. Por favor contáctenos por <a href="https://wa.me/' + CONFIG.whatsappNumber + '" target="_blank">WhatsApp</a>.'
                };
            }
            
            return { allowed: true };
        }
        
        /**
         * Record submission for rate limiting
         */
        function recordSubmission() {
            var now = Date.now();
            lastSubmissionTime = now;
            submissionHistory.push(now);
        }
        
        /**
         * Sanitize general input
         */
        function sanitizeInput(value, maxLength) {
            if (!value) return '';
            maxLength = maxLength || 500;
            return value
                .trim()
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .replace(/[<>]/g, '') // Remove < and >
                .substring(0, maxLength);
        }
        
        /**
         * Sanitize email
         */
        function sanitizeEmail(value) {
            if (!value) return '';
            return value
                .trim()
                .toLowerCase()
                .replace(/[<>]/g, '')
                .substring(0, 254);
        }
        
        /**
         * Sanitize phone
         */
        function sanitizePhone(value) {
            if (!value) return '';
            return value
                .trim()
                .replace(/[^\d+\-\s()]/g, '')
                .substring(0, 20);
        }
        
        /**
         * Validate entire form
         */
        function validateForm(data) {
            var errors = [];
            
            // Name
            if (!data.name || data.name.length < CONFIG.minNameLength) {
                errors.push('Ingrese su nombre completo');
            }
            
            // Email
            if (!isValidEmail(data.email)) {
                errors.push('Ingrese un correo electrónico válido');
            }
            
            // Phone
            if (!isValidPhone(data.phone)) {
                errors.push('Ingrese un número de teléfono válido (7-15 dígitos)');
            }
            
            // Message
            if (!data.message || data.message.length < CONFIG.minMessageLength) {
                errors.push('El mensaje debe tener al menos ' + CONFIG.minMessageLength + ' caracteres');
            }
            
            return errors;
        }
        
        /**
         * Validate single field
         */
        function validateField($field) {
            var name = $field.attr('name');
            var value = $field.val().trim();
            var isValid = true;
            
            switch(name) {
                case 'name':
                    isValid = value.length >= CONFIG.minNameLength;
                    break;
                case 'email':
                    isValid = isValidEmail(value);
                    break;
                case 'phone':
                    isValid = isValidPhone(value.replace(/[\s\-\(\)]/g, ''));
                    break;
                case 'message':
                    isValid = value.length >= CONFIG.minMessageLength;
                    break;
            }
            
            if ($field.prop('required') && !isValid) {
                $field.addClass('is-invalid');
            } else {
                $field.removeClass('is-invalid');
            }
        }
        
        /**
         * Highlight error fields
         */
        function highlightErrors(errors) {
            if (errors.some(function(e) { return e.toLowerCase().includes('nombre'); })) {
                $('#name').addClass('is-invalid');
            }
            if (errors.some(function(e) { return e.toLowerCase().includes('correo'); })) {
                $('#email').addClass('is-invalid');
            }
            if (errors.some(function(e) { return e.toLowerCase().includes('teléfono'); })) {
                $('#phone').addClass('is-invalid');
            }
            if (errors.some(function(e) { return e.toLowerCase().includes('mensaje'); })) {
                $('#message').addClass('is-invalid');
            }
        }
        
        /**
         * Submit form data to server
         */
        function submitToServer(data) {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: CONFIG.serverUrl,
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function(response) {
                        resolve(response);
                    },
                    error: function(xhr) {
                        if (xhr.responseJSON) {
                            resolve(xhr.responseJSON);
                        } else {
                            reject(new Error('Network error'));
                        }
                    }
                });
            });
        }
        
        /**
         * Show feedback message
         */
        function showFeedback(message, type) {
            $feedback
                .html(message)
                .removeClass('success error')
                .addClass(type)
                .fadeIn(300);
        }
        
        /**
         * Hide feedback message
         */
        function hideFeedback() {
            $feedback.fadeOut(200).removeClass('success error');
        }
        
        /**
         * Set loading state
         */
        function setLoading(isLoading) {
            if (isLoading) {
                $submitBtn
                    .prop('disabled', true)
                    .html('<i class="fa fa-spinner fa-spin" style="margin-right: 10px;"></i>Enviando...');
            } else {
                $submitBtn
                    .prop('disabled', false)
                    .html(originalBtnText);
            }
        }
        
        /**
         * Validate email format
         */
        function isValidEmail(email) {
            var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }
        
        /**
         * Validate phone format
         */
        function isValidPhone(phone) {
            var regex = /^[0-9]{7,15}$/;
            return regex.test(phone);
        }
    });
    
})(jQuery);

// Add CSS for form validation states
(function() {
    var style = document.createElement('style');
    style.textContent = [
        '.form-control.is-invalid {',
        '  border-color: #dc3545 !important;',
        '  background-image: url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'none\' stroke=\'%23dc3545\' viewBox=\'0 0 12 12\'%3e%3ccircle cx=\'6\' cy=\'6\' r=\'4.5\'/%3e%3cpath stroke-linejoin=\'round\' d=\'M5.8 3.6h.4L6 6.5z\'/%3e%3ccircle cx=\'6\' cy=\'8.2\' r=\'.6\' fill=\'%23dc3545\' stroke=\'none\'/%3e%3c/svg%3e");',
        '  background-repeat: no-repeat;',
        '  background-position: right calc(0.375em + 0.1875rem) center;',
        '  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);',
        '}',
        '.form-control.is-invalid:focus {',
        '  box-shadow: 0 0 0 3px rgba(220,53,69,.25) !important;',
        '}'
    ].join('\n');
    document.head.appendChild(style);
})();