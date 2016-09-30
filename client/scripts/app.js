$(function() {
    var form = $('#todoForm');
    var url = form.attr('action');
    var incompleteCount = null;

    model = {
        list: [],

        //function gets latest version of todo list from server and render it in the view
        init: function() {
            $.ajax({
                url : "/todos",
                type: "get",
                success: function(data) {
                    model.list = JSON.parse(data);
                    listView.render();
                },
            });
        },

        //function responsible for updating incomplete todos, gets current model list length and adds to variable incompleteCount
        count: function() {
            //clear the count when this method is called
            incompleteCount = null;
            for (i = 0; i < model.list.length; i++) {
                item = model.list[i];
                var complete = item.complete;
                if (!complete) {
                    incompleteCount++
                }
            }
        }
    };

    //responsible for communication with the model
    controller = {
        getList: function() {
            return model.list;
        },

        getCount: function() {
            model.count();
        },

        updateList: function(){
            form.submit(function(e){
                e.preventDefault();
                var todoString = $(this).find('input:text').val();

                //replicate object structure
                var newTodo = {
                    text: todoString,
                    complete: false
                };

                //post to server if input is not empty and re-init the model
                if(todoString.length > 0) {
                    $.ajax({
                        type: "post",
                        contentType: "application/json",
                        url : url,
                        data: JSON.stringify(newTodo),
                        success: function()
                        {
                            model.init();
                            form.find('input:text').val('');
                        },
                    });
                }
            });
        },

        //deletes an item from the list
        itemDelete: function(del) {
            var thisTodoID = $(del.currentTarget).parents('li').attr('data-id');
            $.ajax({
                type: "delete",
                contentType: "application/json",
                url : url + "/" + thisTodoID,
                success: function()
                {
                    model.init();
                },
            });
        },

        //clears all items from the list - to-do: find another way to reuse the itemDelete function above that doesn't require .click(); on a UI element.
        bulkClear: function() {
            $('#todoList li').each(function(del) {
                if($(this).attr('data-complete') == "true") {
                    $(this).find('.removeItem').click();
                }
            });
        },

        //toggles an item's status as complete
        itemToggleComplete: function(complete) {
            var thisTodoID = $(complete.currentTarget).parents('li').attr('data-id');
            var thisCompleteState = $(complete.currentTarget).parents('li').attr('data-complete');
            var thisTodoText = $(complete.currentTarget).parents('li').text();

            var updatedTodo = {
                text: thisTodoText,
                complete: null
            };

            $.ajax({
                type: "put",
                contentType: "application/json",
                url : url + "/" + thisTodoID,
                data: JSON.stringify(updatedTodo),
                success: function()
                {
                    model.init();
                },
            });
        },

        //init function that activates the app
        init: function() {
            controller.updateList();
            model.init();
            listView.init();
        }
    };

    //View methods repsonsible for rending the UI as well as binding to input methods
    listView = {
        init: function() {
            //binding click functions
            $(document.body).on('click', '.removeItem', function(del){
                del.preventDefault();
                controller.itemDelete(del);
            });

            $(document.body).on('click', '.complete', function(complete){
                complete.preventDefault();
                controller.itemToggleComplete(complete);
            });

            $(document.body).on('click', '.filter', function(filter){
                filter.preventDefault();
                listView.filterItems(filter);
            });

            $('.clearCompleted').on('click', function(clear) {
                clear.preventDefault();
                controller.bulkClear(clear);
            });

            //bind enter
            form.bind('keypress', function(e) {
                if(e.keyCode==13){
                    form.submit();
                    return false;
                }
            });

            //bind double click for edit
            $(document.body).on("dblclick", ".todoList__listItem", function(item) {
                //future edit functionality goes here
            });    

        },

        //todo filter logic, filters complete - incomplete or removes filter
        filterItems: function(filter) {
            var thisFilter = $(filter.currentTarget);
            $('.hidden').removeClass('hidden');
            if (thisFilter.is('.completeTask')) {
                $('[data-complete="true"]').addClass('hidden');
            } else if (thisFilter.is('.incompleteTask')) {
                $('[data-complete="false"]').addClass('hidden');
            }
        },

        //master render function - renders the entire UI after model.init runs
        render: function() {
            var todoItems = controller.getList();
            var length = 0
            var checked = null;
            //empty the list so it ready for updating
            $('#todoList').empty();
            //default to bulk-clear showing
            $('.clearCompleted').removeClass('notSowing');


            //populate list
            for (i = 0; i < todoItems.length; i++) {
                item = todoItems[i]
                //logic for checked vs. non-checked items
                if (item.complete) {
                    checked = 'checked';
                } else {
                    checked = 'null'
                }

                //template for items
                $('#todoList').append('<li class="todoList__listItem" data-complete=' + item.complete + ' data-id=' + item.id + '><input type="checkbox" class="complete" '+ checked +' id="'+ item.id +'"/><label for="'+ item.id + '">' + item.text + '</label><a href="#" class="removeItem"></a></li>');
                
                length ++
            };
            controller.getCount();

            //hide/show count text and bulk clear UI items depending on length of incomplete items
            if (incompleteCount > 0) {
                $('.incompleteItemCount').text(incompleteCount + " items remaining");
            } else {
                $('.incompleteItemCount').text('there are no incomplete items');
            };

            if (model.list.length == $('[data-complete="false"]').length) {
                $('.clearCompleted').addClass('notSowing');
            };
        }
    };

    controller.init(); 

}); 