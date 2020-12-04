var elements = document.getElementsByTagName('*');
var dict = initialise_dict();
var delay = 250;
var message_id = 0;

const tags = ["<s>", "<rgb>", "<pl>", "<i>"];
const emotes = ["test"];



// DICT CHANGES____________________________________________________________________________v

function initialise_dict() {
    //Creates a default dictionary of all messages in the array at time of initialisation.
    var arr = get_array()
    var dict = {};
    for (var i=0; i<arr.length; i++) {
        dict[i.toString()] = {'message':arr[i].innerText,
                              'message_id':message_id
                            };
        message_id++;
    }
    return dict;
}

function update_dict() {
    //For each array item not already in the dictionary, a new instance is created inside the object with the message text
    // as the value with the array index as the key
    var arr = get_array();
    for (var i=0; i<arr.length; i++) {
        if (!(i.toString() in dict)) {
            dict[i.toString()] = {'message':arr[i].innerText,
                                  'message_id':message_id
                                };
            message_id++;
        }
    }
}

// DICT CHANGES____________________________________________________________________________^






// RANDOM FUNCS____________________________________________________________________________v

function get_array() {
    //Uses a spread function to turn the HTMLCollection object of all messages with class Linkify into an  array
    return [...document.getElementsByClassName('Linkify')];
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

function generate_img(name) {
    path = 'images/'+name+'.jpg';
    if (emotes.includes(name)) {
        let img = document.createElement("img");
        img.src = chrome.runtime.getURL(path);
        img.setAttribute('height','10%');
        img.setAttribute('width','10%');
        return img;
    }
    else {
        return false;
    }
}



// RANDOM FUNCS____________________________________________________________________________^




// PROPERTY CHANGES____________________________________________________________________________v



function add_property(tag, i) {
    update_dict();
    dict[i.toString()][tag] = tag;
}

function add_custom_property(tag, i, val) {
    update_dict(t);
    dict[i.toString()][tag] = val;
}


function apply_properties(i, message) {
    update_dict();
    var message_tags = dict[i.toString()];
    if (dict[i.toString()].hasOwnProperty('<rgb>')) {
        c = [getRandomInt(0,255),getRandomInt(0,255),getRandomInt(0,255)];
        rgb_str = "color:rgb("+c[0].toString()+","+c[1].toString()+","+c[2].toString()+")";
        message.style = rgb_str;
    }
    if (dict[i.toString()].hasOwnProperty('<pl>')) {
        var pig_latin = convert_to_pig_latin(i);
        change_message(message,pig_latin);
    }
    if (dict[i.toString()].hasOwnProperty('<i>')) {
        let og_message = dict[i.toString()]['message'];
        change_message(message, "");
        add_image(i, message, og_message);
        delete dict[i.toString()]['<i>'];
        // change_message(message, "\n");
    }
    if (dict[i.toString()].hasOwnProperty('<s>')) {
        make_message_secret(message);
        if (message.matches(':hover')) {
            delete dict[i.toString()]['<s>'];
            change_message(message,dict[i.toString()]['message']);
            apply_properties(i,message);
        }
    }

}


// PROPERTY CHANGES____________________________________________________________________________^




// MESSAGE CHANGES____________________________________________________________________________v


function change_message(message, text) {
    //This changes the text of the message depending on what is passed through
    message.innerText = text;
}

function change_html(message, text) {
    message.innerHTML = text;
}


function make_message_secret(message) {
    change_message(message, "<----Hover To Unlock---->");
}

function change_messages(tags) {
    //Gets the most recent dictionary of messages, looping through each message and getting the message from the dictionary.
    // If a message is hovered, it is revealed upon the conditions of the tag.
    var arr = get_array();
    update_dict();

    for (var i = 0; i < arr.length; i++) {
        var message = arr[i];
        var default_text = dict[i.toString()]['message'];
        
        // FIND A WAY TO REPLACE THE <s> TAG WITH THE HOVER ELEMENT SO IT CAN BE INCLUDED WITH THE REST OF TAG REMOVAL

        for (var j = 0; j < tags.length; j++) {
            var tag = tags[j];
            while (default_text.includes(tag)) {
                add_property(tag, i);
                default_text = default_text.replace(tag, "");
                change_message(message, default_text);
            }
            dict[i.toString()]['message'] = default_text;
        }
    }
}

function convert_to_pig_latin(i) {
    let message = '';
    var text = dict[i.toString()]['message'];
    var word_arr = word_arr = text.split(" ").filter( i => i!="");
    for (var i=0; i<word_arr.length; i++) {
        let word = word_arr[i];
        message += word.slice(1,)+word[0]+"ay ";
    }
    return message;
    
}

function add_image(i, message, og_message) {
    //Add images for each message
    //create image for each message
    var text_arr = dict[i.toString()]['message'].split(" ").filter( i => i!="");
    for (let j=0; j<text_arr.length; j++) {
        let message_dict_id = dict[i.toString()]['message_id'];
        let img = generate_img(text_arr[j]);
        console.log(img);
        if (img !== false) {
            [...document.getElementsByClassName('Linkify')][message_dict_id].appendChild(img);
        }
        else {
            change_message(message, "HELP ME");
        }
        
    }

}

// MESSAGE CHANGES____________________________________________________________________________^



function test_tags() {
    var arr = get_array();
    update_dict();
    for (var i = 0; i < arr.length; i++) {
        var message = arr[i];
        apply_properties(i, message);
        
    }
}


//This alters and reveals messages at the same rate as the delay, to check the status of messages
window.setInterval(function(){
    change_messages(tags);
  }, delay);

window.setInterval(function(){
    update_dict()
    test_tags();
  }, delay*2);

