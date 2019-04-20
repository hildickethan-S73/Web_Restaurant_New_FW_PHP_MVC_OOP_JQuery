$(function() {
    $('#datepicker').datepicker({
        dateFormat: 'yy-mm-dd', 
        changeMonth: true, 
        changeYear: true, 
        yearRange: '0:+2',
        /*onSelect: function(selectedDate) {
        }*/
    });
});