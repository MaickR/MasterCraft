$(document).ready(function() {
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        var name = $('#name').val();
        var company = $('#company').val();
        var email = $('#email').val();
        var phone = $('#phone').val();
        var message = $('#message').val();
        
        var whatsappMessage = "Hola, soy " + name;
        if(company) whatsappMessage += " de la empresa " + company;
        whatsappMessage += ". \n\n";
        whatsappMessage += "Mi correo es: " + email + "\n";
        whatsappMessage += "Mi teléfono es: " + phone + "\n\n";
        whatsappMessage += "Mensaje: " + message;
        
        var encodedMessage = encodeURIComponent(whatsappMessage);
        var whatsappNumber = "573001234567"; // Replace with actual number
        
        var whatsappUrl = "https://wa.me/" + whatsappNumber + "?text=" + encodedMessage;
        
        window.open(whatsappUrl, '_blank');
    });
});