/*
* @author: @hagopj13
* @repo: https://github.com/hagopj13/node-express-boilerplate/blob/master/src/models/plugins/toJSON.plugin.js
* */

/*
* TODO:
*  1- Understand the plugin code
*  2- Finish it
* */

const deletePath = (obj, path, index) => {
    if(index === path.length - 1){
        delete obj[path[index]]
        return
    }
    return delete(obj[path[index]], path, index + 1);
}

const toJSON = (schema) => {
   let transform

    if (schema.options.toJSON && schema.options.toJSON.transform) {
        transform = schema.options.toJSON.transform;
    }

    // schema.options.toJSON == Object.assign(schema.options.toJSON || {}, {
    //
    // })

}