'use strict';
exports.handlers = {

    symbolFound:function(e) {
        if(e.astnode.type === "FunctionDeclaration" ) {
            if( (e.comment==="@undocumented")){
                e.comment = '/** undocumented */';
            }
        }
    }
};
