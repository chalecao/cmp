define(function(){

    var repository = {};

    var redoQueue = [];
    var undoQueue = [];

    var commandManager = {

        execute : function(command){
            var args = Array.prototype.slice.call(arguments, 1);
            if(repository[command]){
                var res = repository[command].execute.apply(window, args);

                if(command.unexecute){
                    undoQueue.push({
                        command : command,
                        args : args
                    });
                }

                return res;
            };
        },

        undo : function(){
            var op = undoQueue.pop();
            var command = op.command,
                args = op.args;

            if(repository[command]){
                repository[command].unexecute.apply(window, args);
                redoQueue.push(op);
            };
        },

        redo : function(){
            var op = redoQueue.pop();
            var command = op.command,
                args = op.args;

            if(repository[command]){
                repository[command].execute.apply(window, args);
                undoQueue.push(op);
            }
        },
        /**
         * @param command
         * @param operation
         *
         * @example
         * {
                execute : function(){
    
                },
                unexecute : function(){
    
                }
            }
         */
        register : function(command, operation){
            repository[command] = operation;
        }
    };

    return commandManager;
})