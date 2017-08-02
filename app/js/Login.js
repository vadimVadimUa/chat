(function () {
    $('#LoginUserBtn').click(function() {
        var name = $('#user-name').val();
        var id = $('#user-id').val();
        var channel = $('#channel').val();


        if(filledFields(name, id, channel)){
            var charWindow = open("Index.html", "displayWindow", "width=600, height=400, status=no, toolbar=no, menubar=no");
        }
    });




    function filledFields(name, id, chanel) {
        // if(!name || !id || !chanel){
        //     return false;
        // }
        return true;
    }
})();



