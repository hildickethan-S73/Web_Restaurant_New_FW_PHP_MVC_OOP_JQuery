function initMap() {    
    var ontinyent = {lat: 38.8220593, lng: -0.6063927};

    var map = new google.maps.Map(document.getElementById('map'), {
        center: ontinyent,
        zoom: 14
    });

    var contentString = 
    '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h3 id="firstHeading" class="firstHeading">Ontinyent</h3>'+
        '<br/>'+
        '<div id="bodyContent">'+
            '<p>Ontinyent is a municipality in the comarca of Vall d\'Albaida in the Valencian Community, Spain.'+
            'It is situated on the right bank of the Clariano or Ontinyent, a tributary of the Xúquer,'+
            'and on the Xàtiva–Alcoi railway.</p>'+
        '</div>'+
    '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        position: ontinyent,
        map: map,
        title: 'Ontinyent'
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
}

////////////////////////////////////////////////
// validation
////////////////////////////////////////////////


function name_validate(name) {
    if (name.length > 0) {
        var regexp = /^([a-zA-Z0-9]{2,16})$/;
        return regexp.test(name);
    }
    return false;
}

function email_validate(email) {
    if (email.length > 0) {
        var regexp = /^([a-zA-Z0-9]{2,20}@[a-zA-Z]{2,12}\.[a-z]{2,3})$/; // very basic email check
        return regexp.test(email);
    }
    return false;
}

function subject_validate(subject) {
    if (subject.length > 0) {
        var regexp = /^([a-zA-Z0-9 \.\,\']{2,50})/;
        return regexp.test(subject);
    }
    return false;
}

function message_validate(message) {
    if (message.length > 0) {
        var regexp = /^([a-zA-Z0-9 \.\,\'\n&]){2,1000}/;
        return regexp.test(message);
    }
    return false;
}

function validation(field,num){
    var result = true;
    switch(num){
        case 0:
            if (!name_validate(field.value))
                result = false;
        break;

        case 1:
            if (!email_validate(field.value))
                result = false;
        break;

        case 2:
            if (!subject_validate(field.value))
                result = false;
        break;

        case 3:
            if (!message_validate(field.value))
                result = false;
        break;
    }
    
    if(!result)
        document.getElementById('contact'+field.name).classList.add('is-not-valid');
    else 
        document.getElementById('contact'+field.name).classList.remove('is-not-valid');

    return result;
}

function validate_form(form) {
    var result = true;
    // console.log(form);

    $.each(form, function(index){
        if(!validation(form[index],index))
            result = false;
    });
    return result;
}

$(document).ready(function () {
    $('#contactsubmit').on('click',function(){
        // needs validation
        var form = $('#contactform').serializeArray();
        console.log(form);

        if (validate_form(form)){
            $.ajax({
                url: 'modules/contact/model/contact.php',
                type: 'POST',
                data: form,
                success: function(data){
                    // data = JSON.parse(data);
                    console.log(data);
                    alert('Your message has been sent to the administrator.');
                    window.location.href = 'home';
                }
            });
        }
    });
});
