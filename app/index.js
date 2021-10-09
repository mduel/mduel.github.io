var AI_ARENA_Core = (function(){var f ={};

f.arena_data = 
{
     user_data:{},
     battledata_id:"",
     battledata:{},
     controls_data:
     {
          spell_selected:0,
          previous_spell_selected:0
     },
};

f.createAI = function()
{
    //Clear Data
    f.arena_data = 
    { 
        connection:"",
        user_data:{},
        battledata_id:"",
        battledata:{},
        controls_data:
        {
            spell_selected:0
        },
    };
 
    //Prepare player data
    f.arena_data.user_data = 
    {
        id:SYS_Utils.idGenerator(20),
        name:"Computer Player",
        character:"character_01",
        blessing:"bl01",
        //The spell[0] is auto generated on the Server so no need to have
        //an spell_index for it. spell_indexes[0] is for spell[1] in the server
        //if an spell_indexes[i] value is 0 it does not mean sp00.
        spell_indexes:[0,1,2,3],
    };

};

f.getServerInput = function(mode)
{
    switch(mode)
    {
        case "join":
            return {
                title:"join",
                body:
                {
                    user_data:f.arena_data.user_data
                }
            };
        break;
        case "update":
            updateAIControls();
            return {
                title:"update",
                body:
                {
                    player_id: f.arena_data.user_data.id,
                    battledata_id: f.arena_data.battledata_id,
                    controls_data: f.arena_data.controls_data
                }
            };
        break;
    };
};

function updateAIControls()
{   
    var mode = 1;

    switch(mode)
    {
        case 0:
            f.arena_data.controls_data.spell_selected = 0;
        break;
        case 1:
            f.arena_data.controls_data.spell_selected = ENGINE_Utils.rng(1,4);
        break;
        case 2:
            f.arena_data.controls_data.spell_selected = 1;
        break;
    };
};


return f;}());var ARENA_Core = (function(){var f ={};

f.initializeInterface = function()
{   
    //1ST STEP
    //Clear the interface first before adding anything
    SYS_UI.clear({id:SYS_UI.body});

    //2ND STEP
    ARENA_Interface_Background.initialize();
    
    //3RD STEP
    ARENA_Interface_PlayerInfo.initialize();
    ARENA_Interface_Control.initialize();

    //5TH STEP
    //Make sure to create the playerinfo first before
    //creating the battleground to get the correct position
    ARENA_Interface_Battleground.initialize();

    
    //6TH STEP
    ARENA_Module_PlayerData.create("arena_playerinfo_player1_div","player1");
    ARENA_Module_PlayerData.create("arena_playerinfo_player2_div","player2");

    //7TH STEP
    ARENA_Module_PlayerStatus.create("player1");
    ARENA_Module_PlayerStatus.create("player2");

    //8TH STEP
    ARENA_Module_Time.create("arena_playerinfo_time_div");

    //9TH STEP
    ARENA_Module_Spells.create("arena_control_spells_div");
    ARENA_Module_Options.create("arena_control_options_div");
    
    //10TH STEP
    ARENA_Module_Canvas.create("arena_battleground_layout_div");

};

f.updateInterface = function()
{
    ARENA_Module_Time.update();
    ARENA_Module_PlayerData.update();
    ARENA_Module_PlayerStatus.update();
    ARENA_Module_Canvas.update();
    ARENA_Module_Spells.update();
};

return f;}());var ARENA_Interface_Background = (function(){var f ={};

f.initialize = function()
{
    //Create the background interface
   createBackground(SYS_UI.body);
    
};

function createBackground(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(SYS_Data.game.orientation === "portrait")
    {
        v.background_image  = DATA_Image.getImage({name:"game_background",w:v.holder_width,h:v.holder_height});
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        v.background_image  = DATA_Image.getImage({name:"game_background",w:v.holder_width,h:v.holder_height});
    };

    SYS_UI.create([
        {
            type:"div", 
            id:"arena_background_div", 
            attach:div_holder,
            style:{
                width: v.holder_width.toString() + "px",
                height: v.holder_height.toString() + "px",
                position:"absolute",
                top:"0px",
                left:"0px",
                zIndex:0,
                background:"transparent",
                backgroundImage: `url( ${  v.background_image })`,
                backgroundSize:  v.holder_width.toString() + "px" + " " +  v.holder_height.toString() + "px"
            }
        },
    ]);

};

return f;}());var ARENA_Interface_Battleground = (function(){var f ={};

f.initialize = function()
{
    //Now create the layout
    createLayout(SYS_UI.body);
    
};

function createLayout(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    v.layout_playerinfo_width = parseInt(document.getElementById("arena_playerinfo_layout_div").style.width);
    v.layout_control_width = parseInt(document.getElementById("arena_control_layout_div").style.width);
    v.layout_playerinfo_height = parseInt(document.getElementById("arena_playerinfo_layout_div").style.height);
    v.layout_control_height = parseInt(document.getElementById("arena_control_layout_div").style.height);
    
    if(SYS_Data.game.orientation === "portrait")
    {
        //Get the height
        v.n_remaining_height = v.holder_height - (v.layout_control_height + v.layout_playerinfo_height);
        v.n_height = v.n_remaining_height * 0.90;

        //Get the width
        v.n_width = v.holder_width * 0.90;

        //Detect what size to follow
        if(v.n_height < v.n_width && v.n_width > v.n_height)
        {   
            v.n_width = v.n_height;
        }
        else if(v.n_width < v.n_height && v.n_height > v.n_width)
        {   
            v.n_height = v.n_width;
        }
        else if(v.n_width === v.n_height && v.n_height === v.n_width)
        {   
            v.n_height = v.n_width;
        };

        //Get the horizontal center
        v.n_empty_horizontal_space = v.n_remaining_height - v.n_height;
        v.n_top = v.layout_playerinfo_height + (v.n_empty_horizontal_space / 2)

        //Get the vertical center
        v.n_empty_vertical_space = v.holder_width - v.n_width;
        v.n_left = v.n_empty_vertical_space / 2;

        //Apply sizes
        v.arena_battleground_layout_div_top = v.n_top;
        v.arena_battleground_layout_div_left = v.n_left;
        v.arena_battleground_layout_div_height = v.n_height;
        v.arena_battleground_layout_div_width = v.n_width;
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        //Get the width
        v.n_remaining_width = v.holder_width - (v.layout_playerinfo_width + v.layout_control_width)
        v.n_width = v.n_remaining_width * 0.90;

        //Get the height
        v.n_height = v.holder_height * 0.90;
    
        //Detect what size to follow
        if(v.n_height < v.n_width && v.n_width > v.n_height)
        {   
            v.n_width = v.n_height;
        }
        else if(v.n_width < v.n_height && v.n_height > v.n_width)
        {   
            v.n_height = v.n_width;
        }
        else if(v.n_width === v.n_height && v.n_height === v.n_width)
        {   
            v.n_height = v.n_width;
        };

        //Get the vertical center
        v.n_empty_vertical_space = v.n_remaining_width - v.n_width;
        v.n_left = v.layout_playerinfo_width + (v.n_empty_vertical_space / 2);

        //Get the horizontal center
        v.n_empty_horizontal_space = v.holder_height - v.n_height;
        v.n_top = v.n_empty_horizontal_space / 2;

        //Apply sizes
        v.arena_battleground_layout_div_top = v.n_top;
        v.arena_battleground_layout_div_left = v.n_left;
        v.arena_battleground_layout_div_height = v.n_height;
        v.arena_battleground_layout_div_width = v.n_width;
    };
    
    SYS_UI.create([
        {
            type:"div", 
            id:"arena_battleground_layout_div", 
            attach:div_holder,
            style:{
                width: v.arena_battleground_layout_div_width.toString() + "px",
                height: v.arena_battleground_layout_div_height.toString() + "px",
                position:"absolute",
                top: v.arena_battleground_layout_div_top.toString() + "px",
                left:v.arena_battleground_layout_div_left.toString() + "px",
                zIndex:1,
            }
        },
    ]);
};

return f;}());var ARENA_Interface_Control = (function(){var f ={};

f.initialize = function()
{
    //Now create the layout
    createLayout(SYS_UI.body);

    //Create components
    if(SYS_Data.game.orientation === "portrait")
    {
        createComponentsPortrait("arena_control_layout_div");
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        createComponentsLandscape("arena_control_layout_div");
    };
    
};

function createLayout(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(SYS_Data.game.orientation === "portrait")
    {
        //Get the height
        v.d1 = v.holder_height * 0.20;

        //Get the width
        v.d2 = v.d1 * 2.2;
        if(v.d2 > v.holder_width){ v.d2 = v.holder_width * 0.80; };

        //Get the vertical bottom position
        v.d3 = v.holder_height - v.d1;

        //Get the horizontal center position
        v.d4 = ( v.holder_width / 2 ) - (v.d2 / 2);

        v.arena_control_layout_div_top = v.d3;
        v.arena_control_layout_div_left = v.d4;
        v.arena_control_layout_div_height = v.d1;
        v.arena_control_layout_div_width = v.d2;
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        //Get the width
        v.d1 = v.holder_width * 0.18;

        //Get the height
        v.d2 = v.d1 * 2.5;
        if(v.d2 > v.holder_height){ v.d2 = v.holder_height * 0.80 };

        //Get the horizontal bottom
        v.d3 = v.holder_width - v.d1;

        //Get the vertical center
        v.d4 = (v.holder_height / 2) - (v.d2 / 2);

        v.arena_control_layout_div_top = v.d4;
        v.arena_control_layout_div_left = v.d3;
        v.arena_control_layout_div_height = v.d2;
        v.arena_control_layout_div_width = v.d1;
    };

    SYS_UI.create([
        {
            type:"div", 
            id:"arena_control_layout_div", 
            attach:div_holder,
            style:{
                width: v.arena_control_layout_div_width.toString() + "px",
                height: v.arena_control_layout_div_height.toString() + "px",
                position:"absolute",
                top: v.arena_control_layout_div_top.toString() + "px",
                left: v.arena_control_layout_div_left.toString() + "px",
                zIndex:1,
                backgroundColor:"white"
            }
        },
    ]);

};

function createComponentsPortrait(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    v.control_spells_div_width = v.holder_width;
    v.control_spells_div_height = v.holder_height * 0.80;

    v.control_options_div_width = v.holder_width;
    v.control_options_div_height = v.holder_height * 0.20;


    SYS_UI.style([{
        id:"arena_control_layout_div",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
    }]);

    SYS_UI.create([
        {
            type:"div",
            id:"arena_control_spells_div",
            attach:div_holder,
            style:{
                width:v.control_spells_div_width.toString() + "px",
                height:v.control_spells_div_height.toString() + "px",
                display:"flex",
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
            }
        },
        {
            type:"div",
            id:"arena_control_options_div",
            attach:div_holder,
            style:{
                width:v.control_options_div_width.toString() + "px",
                height:v.control_options_div_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"flex-end",
            }
        }

    ]);

};

function createComponentsLandscape(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    v.control_temp_div_width = v.holder_width;
    v.control_temp_div_height = v.holder_height * 0.80;

    v.control_options_div_width = v.holder_width;
    v.control_options_div_height = v.holder_height * 0.20;

    v.control_spells_div_width =  v.control_temp_div_width * 0.50;
    v.control_spells_div_height = v.control_temp_div_height; 

    SYS_UI.style([{
        id:"arena_control_layout_div",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
    }]);

    SYS_UI.create([
        {
            type:"div",
            id:"arena_control_temp_div",
            attach:div_holder,
            style:{
                width:v.control_temp_div_width.toString() + "px",
                height:v.control_temp_div_height.toString() + "px",
                display:"flex",
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
            }
        },
        {
            type:"div",
            id:"arena_control_options_div",
            attach:div_holder,
            style:{
                width:v.control_options_div_width.toString() + "px",
                height:v.control_options_div_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
            }
        },
        {
            type:"div",
            id:"arena_control_spells_div",
            attach:"arena_control_temp_div",
            style:{
                width:v.control_spells_div_width.toString() + "px",
                height:v.control_spells_div_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
            }
        }
    ]);

};

return f;}());var ARENA_Interface_PlayerInfo = (function(){var f ={};

f.initialize = function()
{
    //Now create the layout
    createLayout(SYS_UI.body);

    //Create components
    if(SYS_Data.game.orientation === "portrait")
    {
        createComponentsPortrait("arena_playerinfo_layout_div");
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        createComponentsLandscape("arena_playerinfo_layout_div");
    };

};

function createLayout(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(SYS_Data.game.orientation === "portrait")
    {
        //Get the height
        v.d1 = v.holder_height * 0.25;

        //Get the width
        v.d2 = v.d1 * 2;
        if(v.d2 > v.holder_width){ v.d2 = v.holder_width * 0.75 };

        //Get the horizontal center position
        v.d3 = (v.holder_width / 2) - (v.d2 / 2);

        v.arena_playerinfo_layout_div_top = 0;
        v.arena_playerinfo_layout_div_left = v.d3;
        v.arena_playerinfo_layout_div_height = v.d1;
        v.arena_playerinfo_layout_div_width = v.d2;
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        //Get the width
        v.d1 = v.holder_width * 0.20;

        //Get the height
        v.d2 = v.d1 * 3;
        if(v.d2 > v.holder_height){ v.d2 = v.holder_height * 0.90 };

        //Get the vertical center
        v.d3 = ( v.holder_height / 2 ) - ( v.d2 / 2 );

        v.arena_playerinfo_layout_div_top = v.d3;
        v.arena_playerinfo_layout_div_left = 0;
        v.arena_playerinfo_layout_div_height = v.d2;
        v.arena_playerinfo_layout_div_width = v.d1;
    };

    SYS_UI.create([
        {
            type:"div", 
            id:"arena_playerinfo_layout_div", 
            attach:div_holder,
            style:{
                width: v.arena_playerinfo_layout_div_width.toString() + "px",
                height: v.arena_playerinfo_layout_div_height.toString() + "px",
                position:"absolute",
                top: v.arena_playerinfo_layout_div_top.toString() + "px",
                left:v.arena_playerinfo_layout_div_left.toString() + "px",
                zIndex:1,
                backgroundColor:"white"
            }
        },
    ]);

};

function createComponentsPortrait(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    v.playerinfo_time_div_width = v.holder_width * 0.60;
    v.playerinfo_time_div_height = v.holder_height * 0.18;

    v.playerinfo_temp_div_width = v.holder_width;
    v.playerinfo_temp_div_height = v.holder_height * 0.80;

    v.playerinfo_player1_div_width = v.playerinfo_temp_div_width * 0.45;
    v.playerinfo_player1_div_height = v.playerinfo_temp_div_height * 0.90;

    v.playerinfo_player2_div_width = v.playerinfo_temp_div_width * 0.45;
    v.playerinfo_player2_div_height = v.playerinfo_temp_div_height * 0.90;

    SYS_UI.style([{
        id:"arena_playerinfo_layout_div",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
    }]);

    SYS_UI.create([
        {
            type:"div",
            id:"arena_playerinfo_time_div",
            attach:div_holder,
            style:{
                width:v.playerinfo_time_div_width.toString() + "px",
                height:v.playerinfo_time_div_height.toString() + "px",
                display:"flex",
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
            }
        },
        {
            type:"div",
            id:"arena_playerinfo_temp_div",
            attach:div_holder,
            style:{
                width:v.playerinfo_temp_div_width.toString() + "px",
                height:v.playerinfo_temp_div_height.toString() + "px",
                display:"flex",
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
            }
        },
        {
            type:"div",
            id:"arena_playerinfo_player1_div",
            attach:"arena_playerinfo_temp_div",
            style:{
                width:v.playerinfo_player1_div_width.toString() + "px",
                height:v.playerinfo_player1_div_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                margin:"auto",
                backgroundColor:"#FFCCCB"
            }
        },
        {
            type:"div",
            id:"arena_playerinfo_player2_div",
            attach:"arena_playerinfo_temp_div",
            style:{
                width:v.playerinfo_player1_div_width.toString() + "px",
                height:v.playerinfo_player1_div_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                margin:"auto",
                backgroundColor:"#CAE9F5"
            }
        },

    ]);

};

function createComponentsLandscape(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    v.playerinfo_time_div_width = v.holder_width * 0.60;
    v.playerinfo_time_div_height = v.holder_height * 0.10;

    v.playerinfo_player1_div_width = v.holder_width * 0.90;
    v.playerinfo_player1_div_height =  v.holder_height * 0.40;

    v.playerinfo_player2_div_width = v.holder_width * 0.90;
    v.playerinfo_player2_div_height = v.holder_height * 0.40;

    SYS_UI.style([{
        id:"arena_playerinfo_layout_div",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
    }]);

    SYS_UI.create([
        {
            type:"div",
            id:"arena_playerinfo_time_div",
            attach:div_holder,
            style:{
                width:v.playerinfo_time_div_width.toString() + "px",
                height:v.playerinfo_time_div_height.toString() + "px",
                display:"flex",
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
            }
        },
        {
            type:"div",
            id:"arena_playerinfo_player1_div",
            attach:div_holder,
            style:{
                width:v.playerinfo_player1_div_width.toString() + "px",
                height:v.playerinfo_player1_div_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                marginTop:"5%",
                backgroundColor:"#FFCCCB"
            }
        },
        {
            type:"div",
            id:"arena_playerinfo_player2_div",
            attach:div_holder,
            style:{
                width:v.playerinfo_player1_div_width.toString() + "px",
                height:v.playerinfo_player1_div_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                marginTop:"5%",
                backgroundColor:"#CAE9F5"
            }
        },

    ]);

};

return f;}());var ARENA_Module_Canvas = (function(){var f ={};

var environment_canvas_rendered = false;

f.create = function(div_holder)
{
    //Clear the interface first before adding anything
    //we only use div_middle because that is where
    //the canvas is attached
    SYS_UI.clear({id:div_holder});

    //Now create the main canvas
    createCanvas(div_holder);
    
};

function createCanvas(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    v.canvas_layers = 4;

    //We need to start at zero so we reduce by 1 and
    //set i to zero so that we can sync with future
    //server data
    for(var i = 0; i <= v.canvas_layers - 1; i++)
    {
        SYS_UI.create([
            {
                type:"canvas",
                id: "arena_canvas_"+i,
                attach:div_holder,
                style:{
                    width:v.holder_width.toString() + "px",
                    height:v.holder_height.toString() + "px",
                    position:"absolute",
                    zIndex:i + 1,
                    border:"2px solid black"
                }
            }
        ]);  

        v.canvas = document.getElementById("arena_canvas_"+i);
        v.dpr = window.devicePixelRatio || 3;
        v.rect = v.canvas.getBoundingClientRect();
        v.canvas.width = v.rect.width * v.dpr;
        v.canvas.height = v.rect.height * v.dpr;
    };

};

f.update = function()
{
    var battledata = SYS_Data.arena_data.battledata;

    var canvas_environment_check = document.getElementById("arena_canvas_0");
    var ctx_environment_check = canvas_environment_check.getContext('2d');
    var canvas_environment = document.getElementById("arena_canvas_1");
    var ctx_environment = canvas_environment.getContext('2d');
    var canvas_characters = document.getElementById("arena_canvas_2");
    var ctx_characters = canvas_characters.getContext('2d');
    var canvas_sfx = document.getElementById("arena_canvas_3");
    var ctx_sfx = canvas_sfx.getContext('2d');

    //UPDATE THE ENVIRONMENT
    //In order to ensure that the environment will
    //surely be rendered then we will use getImageData
    //and not boolean or any other checking type
    //also using getImageData creates a black line at the center
    //so we need to seperate the environment of two players in
    //two canvas to prevent the bug
    var canvas_environment_check_data = ctx_environment_check.getImageData(0,0,5,5);
    var canvas_environment_check_contents = 0;

    //Detect if the map is empty
    for (var value of Object.values(canvas_environment_check_data.data))
    {
        canvas_environment_check_contents += parseInt(value);
    }

    //Start render
    if(canvas_environment_check_contents <= 0)
    {
        //We need to repeat the player1 rendering for the
        //environment check. It will not be visible during play
        ARENA_Renderer.render_environment("player1",canvas_environment_check,ctx_environment_check,battledata);
        ARENA_Renderer.render_environment("player1",canvas_environment,ctx_environment,battledata);
        ARENA_Renderer.render_environment("player2",canvas_environment,ctx_environment,battledata);
    };

    //UPDATE THE CHARACTERS AND SFX
    ctx_characters.clearRect(0,0,canvas_characters.width,canvas_characters.height);
    ctx_sfx.clearRect(0,0,canvas_sfx.width,canvas_sfx.height);

    if(typeof(battledata.core.entities) === "object")
    {
        for(var i = 0; i <= battledata.core.entities.length - 1;i++)
        {
            if(Object.keys(battledata.core.entities[i]).length >= 1)
            {
                if(battledata.core.entities[i].info.class === "character") 
                {
                    ARENA_Renderer.render_entity(canvas_characters,ctx_characters,battledata.core.entities[i]);
                }
                else
                {
                    ARENA_Renderer.render_entity(canvas_sfx,ctx_sfx,battledata.core.entities[i]);
                };
            }
        };
    };  

};

return f;}());var ARENA_Module_Options = (function(){var f ={};

f.create = function(div_holder)
{
    //Clear the interface first before adding anything
    SYS_UI.clear({id:div_holder});

    //Now create the time
    if(SYS_Data.game.orientation === "portrait")
    {
        createOptionsPortrait(div_holder);
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        createOptionsLandscape(div_holder);
    };
};

f.show_options = function()
{   
    var battledata = SYS_Data.arena_data.battledata;

    if(battledata.core.status === "ongoing")
    {
        server_input = 
        {
            title:"pause", body:{ player_id:SYS_Data.arena_data.user_data.id }
        };
        SERVER_GATE.offline(JSON.stringify(server_input));
    }
    else if(battledata.core.status === "pause")
    {
        server_input = 
        {
            title:"unpause", body: { player_id:SYS_Data.arena_data.user_data.id }
        };
        SERVER_GATE.offline(JSON.stringify(server_input));
    };
};

function createOptionsPortrait(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    v.option_button_width = v.holder_width * 0.15;
    v.option_button_height = v.holder_height * 0.90;
    v.option_button_fontSize = v.holder_height * 0.30;

    SYS_UI.create([
        {
            type:"button", 
            id:"arena_option_button", 
            attach:div_holder,
            text:"OPTION",
            style:{
                width: v.option_button_width.toString() + "px",
                height: v.option_button_height.toString() + "px",
                fontSize:v.option_button_fontSize.toString() + "px",
                margin:"3%"
            },
            attrib:
            {
                onclick:`ARENA_Module_Options.show_options();`
            }
        },
        
    ]);    
   
};

function createOptionsLandscape(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    v.option_button_width = v.holder_width * 0.50;
    v.option_button_height = v.holder_height * 0.50;
    v.option_button_fontSize = v.holder_height * 0.20;

    SYS_UI.create([
        {
            type:"button", 
            id:"arena_option_button", 
            attach:div_holder,
            text:"OPTION",
            style:{
                width: v.option_button_width.toString() + "px",
                height: v.option_button_height.toString() + "px",
                fontSize:v.option_button_fontSize.toString() + "px",
            },
            attrib:
            {
                onclick:`ARENA_Module_Options.show_options();`,
            }
        },
    ]);    
   
};


return f;}());var ARENA_Module_PlayerData = (function(){var f ={};

f.create = function(div_holder,player_tag)
{
    //Clear the interface first before adding anything
    SYS_UI.clear({id:div_holder});

    //Now create the main canvas
    createDivs(div_holder,player_tag);

    //Now create the name
    createName("arena_"+player_tag+"_div_name",player_tag);

    //Now create the health bar
    createHealth("arena_"+player_tag+"_div_health",player_tag);

    //Now create the energy bar
    createEnergy("arena_"+player_tag+"_div_energy",player_tag);
    
};

function createDivs(div_holder,player_tag)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    //Width is the same in any orientation
    v.player_div_name_height = v.holder_height * 0.15;
    v.player_div_stat_main_height = v.holder_height * 0.25;
    v.player_div_status_height = v.holder_height * 0.60;

    //Make sure the Blessing Icon is in Square Shape first
    //Then add 3% width to make it a consistent rectangular shape
    v.player_div_stat_1_width = v.holder_width * 0.30;
    if(v.player_div_stat_1_width > v.player_div_stat_main_height)
    {
        v.player_div_stat_1_width = v.player_div_stat_main_height;
    };
    v.player_div_stat_1_width =  v.player_div_stat_1_width + (v.player_div_stat_1_width * 0.20);

    //Get the width from remaining space 
    v.player_div_stat_2_width = v.holder_width - v.player_div_stat_1_width;

    v.player_div_health_height = v.player_div_stat_main_height * 0.50;
    v.player_div_energy_height = v.player_div_stat_main_height * 0.50;
    

    SYS_UI.create([
        {
            type:"div",
            id:"arena_"+player_tag+"_div_name",
            attach:div_holder,
            style:{
                width:v.holder_width.toString() + "px",
                height:v.player_div_name_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                border: "1px solid black"
            }
        },
        {
            type:"div",
            id:"arena_"+player_tag+"_div_stat_main",
            attach:div_holder,
            style:{
                width:v.holder_width.toString() + "px",
                height:v.player_div_stat_main_height.toString() + "px",
                display:"flex",
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
                border: "1px solid black"
            }
        },
        {
            type:"div",
            id:"arena_"+player_tag+"_div_status",
            attach:div_holder,
            style:{
                width:v.holder_width.toString() + "px",
                height:v.player_div_status_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                border:"1px solid black"
            }
        },
        {
            type:"div",
            id:"arena_"+player_tag+"_div_stat_1",
            attach:"arena_"+player_tag+"_div_stat_main",
            style:{
                width:v.player_div_stat_1_width.toString() + "px",
                height:v.player_div_stat_main_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                border: "1px solid black"
            }
        },
        {
            type:"div",
            id:"arena_"+player_tag+"_div_stat_2",
            attach:"arena_"+player_tag+"_div_stat_main",
            style:{
                width:v.player_div_stat_2_width.toString() + "px",
                height:v.player_div_stat_main_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                border: "1px solid black"
            }
        },
        {
            type:"img",
            id:"arena_"+player_tag+"_image_blessing",
            attach:"arena_"+player_tag+"_div_stat_1",
            attrib:{
                src:DATA_Image.getImage("default")
            },
            style:{
                width:"95%",
                height:"95%"
            }
        },
        {
            type:"div",
            id:"arena_"+player_tag+"_div_health",
            attach:"arena_"+player_tag+"_div_stat_2",
            style:{
                width:v.player_div_stat_2_width.toString() + "px",
                height:v.player_div_health_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                border: "1px solid black"
            }
        },
        {
            type:"div",
            id:"arena_"+player_tag+"_div_energy",
            attach:"arena_"+player_tag+"_div_stat_2",
            style:{
                width:v.player_div_stat_2_width.toString() + "px",
                height:v.player_div_energy_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                border: "1px solid black"
            }
        },
    ]);
    
};

function createName(div_holder,player_tag)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    v.player_text_name_fontSize = v.holder_height * 0.5;

    SYS_UI.create([
        {
            type:"p",
            id:"arena_"+player_tag+"_text_name",
            attach:div_holder,
            text:"PLAYER NAME",
            style:{
                fontWeight:"bold",
                fontSize:v.player_text_name_fontSize.toString() + "px"
            }
        }
    ]);
};

function createHealth(div_holder,player_tag)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    SYS_UI.progressBar({
        id:"arena_"+player_tag+"_health",
        width: v.holder_width.toString() + "px",
        height: v.holder_height.toString() + "px",
        bgcolor:"gray",
        color:"green",
        attach:div_holder,
        show_text:true,
        text_color:"white",
        font_size: v.holder_height * 0.70
    });

};

function createEnergy(div_holder,player_tag)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    SYS_UI.progressBar({
        id:"arena_"+player_tag+"_energy",
        width: v.holder_width.toString() + "px",
        height: v.holder_height.toString() + "px",
        bgcolor:"gray",
        color:"blue",
        attach:div_holder,
        show_text:true,
        text_color:"white",
        font_size: v.holder_height * 0.70
    });

};

f.update = function()
{
    var battledata = SYS_Data.arena_data.battledata;

    //UPDATE THE NAME
    document.getElementById("arena_player1_text_name").innerHTML = battledata.player1.name;
    document.getElementById("arena_player2_text_name").innerHTML = battledata.player2.name;

    //UPDATE THE BLESSING
    SYS_UI.attrib([
        {
            id:"arena_player1_image_blessing",
            src:DATA_Blessings.getData(battledata.player1.blessing,"image")
        },
        {
            id:"arena_player2_image_blessing",
            src:DATA_Blessings.getData(battledata.player2.blessing,"image")
        }
    ]);

    //UPDATE THE HEALTH
    SYS_UI.progressBar({
        id:"arena_player1_health",
        current:battledata.player1.stats.health,
        max:battledata.player1.stats.health_max
    });
    SYS_UI.progressBar({
        id:"arena_player2_health",
        current:battledata.player2.stats.health,
        max:battledata.player2.stats.health_max
    });

    //UPDATE THE ENERGY
    SYS_UI.progressBar({
        id:"arena_player1_energy",
        current:battledata.player1.stats.energy,
        max:battledata.player1.stats.energy_max
    });
    SYS_UI.progressBar({
        id:"arena_player2_energy",
        current:battledata.player2.stats.energy,
        max:battledata.player2.stats.energy_max
    });

};

return f;}());var ARENA_Module_PlayerStatus = (function(){var f ={};

f.create = function(player_tag)
{
    //Clear the interface first before adding anything
    SYS_UI.clear({id:"arena_"+player_tag+"_div_status"});

    //Now create the status
    createStatus("arena_"+player_tag+"_div_status",player_tag);
    
};

function createStatus(div_holder,player_tag)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    v.table_tr_height = (v.holder_height / 3) * 0.95;
    v.table_td_width = (v.holder_width / 2) * 0.95;
    v.status_holder_height = v.table_tr_height;
    v.status_holder_width = v.table_td_width;
    v.status_icon_height = v.status_holder_height * 0.70;
    v.status_icon_width = v.status_holder_width * 0.60;
    v.status_code_size = v.status_holder_height * 0.50;
    v.status_stacks_size = v.status_holder_height * 0.50;

    v.status_count = 0;

    SYS_UI.create([
        {
            type:"table",
            id:"arena_"+player_tag+"_table_status",
            attach:div_holder,
            style:{
                width: v.holder_width.toString() + "px",
                height: v.holder_height.toString() + "px",
            }
        },
    ]);

    for(var tr = 0; tr <= 2; tr++)
    {
        SYS_UI.create([
            {
                type:"tr",
                id:"arena_"+player_tag+"_table_status_tr"+tr,
                attach:"arena_"+player_tag+"_table_status",
                style:{
                    width: v.holder_width.toString() + "px",
                    height: v.table_tr_height.toString() + "px",
                }
            },
        ]);    

        for(var td = 0; td <= 1; td++)
        {
            v.status_count++;

            SYS_UI.create([
                {
                    type:"td",
                    id:"arena_"+player_tag+"_table_status_td"+tr+"_"+td,
                    attach:"arena_"+player_tag+"_table_status_tr"+tr,
                    style:{
                        width: v.table_td_width.toString() + "px",
                        height: v.table_tr_height.toString() + "px",
                    }
                },
                {
                    type:"div", 
                    id:"arena_"+player_tag+"_status_holder_"+v.status_count, 
                    attach:"arena_"+player_tag+"_table_status_td"+tr+"_"+td,
                    style:{
                        width: v.status_holder_width.toString() + "px",
                        height: v.status_holder_height.toString() + "px",
                        visibility:"hidden",
                        display:"flex",
                        flexDirection:"row",
                        justifyContent:"center",
                        alignItems:"center"
                    }
                },
                {
                    type:"div", 
                    id:"arena_"+player_tag+"_status_icon_"+v.status_count, 
                    attach:"arena_"+player_tag+"_status_holder_"+v.status_count,
                    style:{
                        width: v.status_icon_width.toString() + "px",
                        height: v.status_icon_height.toString() + "px",
                        backgroundImage: "linear-gradient(red, yellow)",
                        borderRadius:"15px",
                        visibility:"hidden",
                        display:"flex",
                        flexDirection:"column",
                        justifyContent:"center",
                        alignItems:"center"
                    }
                },
                {
                    type:"p", 
                    id:"arena_"+player_tag+"_status_code_"+v.status_count, 
                    attach:"arena_"+player_tag+"_status_icon_"+v.status_count,
                    text:"RCH",
                    style:{
                        fontSize:v.status_code_size.toString() + "px",
                        fontWeight:"bold",
                        color:"white",
                        visibility:"hidden",
                    }
                },
                {
                    type:"p", 
                    id:"arena_"+player_tag+"_status_stacks_"+v.status_count, 
                    attach:"arena_"+player_tag+"_status_holder_"+v.status_count,
                    text:"999",
                    style:{
                        fontSize:v.status_stacks_size.toString() + "px",
                        fontWeight:"bold",
                        marginLeft:"10%"
                    }
                },
            ]);   
        };

    };

};

f.update = function()
{
    var battledata = SYS_Data.arena_data.battledata;

    show_status("player1",battledata.player1.status);
    show_status("player2",battledata.player2.status);

    function show_status(player,statuses)
    {
        for(var i = 1; i <= 6;i++)
        {
            SYS_UI.style([
                {id:"arena_"+player+"_status_icon_"+i, visibility:"hidden"},
                {id:"arena_"+player+"_status_code_"+i, visibility:"hidden"},
                {id:"arena_"+player+"_status_stacks_"+i, visibility:"hidden"}
            ]);
        };

        if(statuses.length >= 1)
        {
            for(var i2 = 0; i2 <= statuses.length - 1;i2++)
            {
                SYS_UI.style([
                    {id:"arena_"+player+"_status_icon_"+(i2+1), visibility:"visible", backgroundImage:statuses[i2].color},
                    {id:"arena_"+player+"_status_code_"+(i2+1), visibility:"visible"},
                    {id:"arena_"+player+"_status_stacks_"+(i2+1), visibility:"visible"}
                ]);

                document.getElementById("arena_"+player+"_status_code_"+(i2+1)).innerHTML = statuses[i2].code;
                document.getElementById("arena_"+player+"_status_stacks_"+(i2+1)).innerHTML = statuses[i2].stacks;
            };
        };
    };

};

return f;}());var ARENA_Module_Spells = (function(){var f ={};

var spell_long_click = false;
var spell_long_click_timeout;
var spell_long_click_success = false;

f.create = function(div_holder)
{
    //Clear the interface first before adding anything
    SYS_UI.clear({id:div_holder});

    //Now create the time
    if(SYS_Data.game.orientation === "portrait")
    {
        createSpellsPortrait(div_holder);
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        createSpellsLandscape(div_holder);
    };

};

f.spell_touchstart = function(){ spellClickStart(); };

f.spell_mousedown = function(){ if(SYS_Data.game.touch_enable === false){ spellClickStart(); }; };

f.spell_touchend = function(button_position){ spellClickEnd(button_position) };

f.spell_mouseup = function(button_position){ if(SYS_Data.game.touch_enable === false){ spellClickEnd(button_position); }; };


function spellClickStart()
{
    spell_long_click = true;
    spell_long_click_success = false;
    spell_long_click_timeout = setTimeout(function() 
    {
        if(spell_long_click === true)
        {
            spell_long_click_success = true;
            //DO SOMETHING
        }
      }, 500);
};

function spellClickEnd(button_position)
{
    spell_long_click = false;
    clearTimeout(spell_long_click_timeout);

    if(spell_long_click_success === false)
    {
        spellClick(button_position);
    };
};

function spellClick(button_position)
{
    //In order to prevent long variable names
    //we will slice it to small chunks
    var battledata = SYS_Data.arena_data.battledata;
    var userdata = SYS_Data.arena_data.user_data;
    var controls_data = SYS_Data.arena_data.controls_data;

    button_position = parseInt(button_position);

    if(button_position === controls_data.spell_selected)
    {
        controls_data.spell_selected = 0;
    }
    else
    {
        //Check if there is enough energy for the selected spell
        //Then set the new spell selected to the current selected
        if(userdata.id === battledata.player1.id) { var player = battledata.player1; }
        else if(userdata.id === battledata.player2.id){ var player = battledata.player2; }

        if(player.stats.energy >= player.spells[button_position].energy_cost)
        {
            controls_data.spell_selected = button_position;
        }
        else if(player.stats.energy < player.spells[button_position].energy_cost)
        {
            controls_data.spell_selected = controls_data.previous_spell_selected;
        };
    };
    
    //Store previous selected spell
    if( controls_data.previous_spell_selected !== controls_data.spell_selected)
    {
        controls_data.previous_spell_selected = controls_data.spell_selected;
    };
};

function createSpellsPortrait(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    v.spells_amount = 4;
    v.spells_count = 0;

    v.spell_holder_width = (v.holder_width / v.spells_amount) * 0.70;
    v.spell_holder_height = v.holder_height * 0.70;

    if(v.spell_holder_width >= v.spell_holder_height)
    {
        v.spell_holder_size = v.spell_holder_height;
        v.spell_image_size = v.spell_holder_height * 0.70;
    }
    else if(v.spell_holder_height > v.spell_holder_width)
    {
        v.spell_holder_size = v.spell_holder_width;
        v.spell_image_size = v.spell_holder_width * 0.70;
    };

    for(var ac = 1; ac <= v.spells_amount; ac++)
    {
        v.spells_count++;

        SYS_UI.create([
            {
                type:"div", 
                id:"arena_spell_holder_"+v.spells_count, 
                attach:div_holder,
                style:{
                    width: v.spell_holder_size.toString() + "px",
                    height: v.spell_holder_size.toString() + "px",
                    position: "relative",
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"center",
                    alignItems:"center",
                    marginLeft:"3%",
                    marginRight:"3%",
                    border: "1px solid black",
                },
                attrib:
                {
                    ontouchstart:`ARENA_Module_Spells.spell_touchstart()`,
                    onmousedown:`ARENA_Module_Spells.spell_mousedown()`,
                    ontouchend:`ARENA_Module_Spells.spell_touchend(${v.spells_count})`,
                    onmouseup:`ARENA_Module_Spells.spell_mouseup(${v.spells_count})`,
                }
            },
            {
                type:"img",
                id:"arena_spell_image_"+v.spells_count,
                attach:"arena_spell_holder_"+v.spells_count,
                attrib:{
                    src:DATA_Image.getImage("default")
                },
                style:{
                    width:v.spell_image_size.toString() + "px",
                    height:v.spell_image_size.toString() + "px",
                }
            },
            {
                type:"div", 
                id:"arena_spell_indicator_"+v.spells_count, 
                attach:"arena_spell_holder_"+v.spells_count,
                style:{
                    width: v.spell_holder_size.toString() + "px",
                    height: v.spell_holder_size.toString() + "px",
                    position: "absolute",
                    zIndex:"2",
                    backgroundColor:"rgba(0,0,0,0.8)",
                    display:"block"
                }
            },
        ]);    
    };
    
};

function createSpellsLandscape(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    v.spells_amount = 4;
    v.spells_count = 0;

    v.spell_holder_height = (v.holder_height / v.spells_amount) * 0.70;
    v.spell_holder_width = v.holder_width * 0.70;

    if(v.spell_holder_width >= v.spell_holder_height)
    {
        v.spell_holder_size = v.spell_holder_height;
        v.spell_image_size = v.spell_holder_height * 0.70;
    }
    else if(v.spell_holder_height > v.spell_holder_width)
    {
        v.spell_holder_size = v.spell_holder_width;
        v.spell_image_size = v.spell_holder_width * 0.70;
    };

    for(var ac = 1; ac <= v.spells_amount; ac++)
    {
        v.spells_count++;

        SYS_UI.create([
            {
                type:"div", 
                id:"arena_spell_holder_"+v.spells_count, 
                attach:div_holder,
                style:{
                    width: v.spell_holder_size.toString() + "px",
                    height: v.spell_holder_size.toString() + "px",
                    position: "relative",
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"center",
                    alignItems:"center",
                    marginTop:"3%",
                    marginBottom:"3%",
                    border: "1px solid black"
                },
                attrib:
                {
                    ontouchstart:`ARENA_Module_Spells.spell_touchstart()`,
                    onmousedown:`ARENA_Module_Spells.spell_mousedown()`,
                    ontouchend:`ARENA_Module_Spells.spell_touchend(${v.spells_count})`,
                    onmouseup:`ARENA_Module_Spells.spell_mouseup(${v.spells_count})`,
                }
            },
            {
                type:"img",
                id:"arena_spell_image_"+v.spells_count,
                attach:"arena_spell_holder_"+v.spells_count,
                attrib:{
                    src:DATA_Image.getImage("default")
                },
                style:{
                    width:v.spell_image_size.toString() + "px",
                    height:v.spell_image_size.toString() + "px",
                }
            },
            {
                type:"div", 
                id:"arena_spell_indicator_"+v.spells_count, 
                attach:"arena_spell_holder_"+v.spells_count,
                style:{
                    width: v.spell_holder_size.toString() + "px",
                    height: v.spell_holder_size.toString() + "px",
                    position: "absolute",
                    zIndex:"2",
                    backgroundColor:"rgba(0,0,0,0.8)",
                    display:"block"
                }
            },
        ]);    
    };
    
};

f.update = function()
{

    var battledata = SYS_Data.arena_data.battledata;
    var userdata = SYS_Data.arena_data.user_data;

    if(userdata.id === battledata.player1.id)
    {
        var color = "red";
        var player = battledata.player1;
    }
    else if(userdata.id === battledata.player2.id)
    {
        var color = "blue";
        var player = battledata.player2;
    }
    
    //RESET FIRST ALL THE SPELLS
    for(var i = 1; i <= 4; i++)
    {
        SYS_UI.style([
            {
                id:"arena_spell_holder_"+i,
                backgroundColor:"white"
            }
        ]);
    };

    //UPDATE THE IMAGES
    //Since we use indexing so we need to start at 1
    for(var i = 1; i <= 4; i++)
    {
        SYS_UI.attrib([
            {
                id:"arena_spell_image_"+(i),
                src:DATA_Spells.getData(player.spells[i].id,"image")
            }
        ]);
    };

    //UPDATE THE ENERGY COST
    //Since we use indexing so we need to start at 1
    for(var i = 1; i <= 4; i++)
    {
        if(player.stats.energy >= player.spells[i].energy_cost)
        {
            SYS_UI.style([
                {
                    id:"arena_spell_indicator_"+(i),
                    display:"none"
                }
            ]);
        }
        else if(player.stats.energy < player.spells[i].energy_cost)
        {
            SYS_UI.style([
                {
                    id:"arena_spell_indicator_"+(i),
                    display:"block"
                }
            ]);
        };
    };


    //COLOR THE SELECTED SPELL
    //If the selected spell can't be casted anymore
    //due to lack of energy then deselected it
    //Dont go to previous selected because it might also can't be casted
    //so to be safe just set the spell selected to 0;
    if(SYS_Data.arena_data.controls_data.spell_selected >= 1)
    {
        if(player.stats.energy >= player.spells[SYS_Data.arena_data.controls_data.spell_selected].energy_cost)
        {
            SYS_UI.style([
                {
                    id:"arena_spell_holder_"+SYS_Data.arena_data.controls_data.spell_selected,
                    backgroundColor:color
                }
            ]);
        }
        else
        {
            SYS_Data.arena_data.controls_data.spell_selected = 0;
        };
    };
    
};

return f;}());var ARENA_Module_Time = (function(){var f ={};

f.create = function(div_holder)
{
    //Clear the interface first before adding anything
    SYS_UI.clear({id:div_holder});

    //Now create the time
    createTime(div_holder);

};

function createTime(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    v.time_text_fontSize = v.holder_height * 0.70;

    SYS_UI.create([
        {
            type:"p",
            id:"arena_time_text",
            attach:div_holder,
            text:"00 | 00",
            style:{
                fontWeight:"bold",
                fontSize:v.time_text_fontSize.toString() + "px"
            }
        }
    ]);
};

f.update = function()
{
    var battledata = SYS_Data.arena_data.battledata;
    
    var round_count = SYS_Utils.generateNumberByTen(battledata.core.round_count);
    var round_timer = SYS_Utils.generateNumberByTen(battledata.core.round_timer);

    document.getElementById("arena_time_text").innerHTML = `${round_count} | ${round_timer}`;
};

return f;}());var ARENA_ONLINE_ErrorConnection = (function(){var f ={};

f.initialize = function()
{
    //Clear the interface first before adding anything
    SYS_UI.clear({id:SYS_UI.body});
    
    //Show the interface
    createInterface(SYS_UI.body);

};

f.continue = function()
{
    HOME_Arena.initialize();
};

//=============================================================================

function createInterface(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(SYS_Data.game.orientation === "portrait")
    {
        v.image_width = v.holder_width * 0.70;
        v.image_height = v.holder_height * 0.10;

        v.button_width = v.holder_width * 0.40;
        v.button_height = v.holder_height * 0.04;

        v.margin = "20%";
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        v.image_width = v.holder_width * 0.45;
        v.image_height = v.holder_height * 0.15;

        v.button_width = v.holder_width * 0.25;
        v.button_height = v.holder_height * 0.06;

        v.margin = "10%"
    };

    SYS_UI.create([
        {
            type:"div", 
            id:"arena_online_main_div", 
            attach:div_holder,
            style:{
                width: v.holder_width.toString() + "px",
                height: v.holder_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                background:"transparent",
                backgroundImage:`url( ${ DATA_Image.getImage({name:"game_background",w:v.holder_width,h:v.holder_height}) })`,
                backgroundSize:  v.holder_width.toString() + "px" + " " +  v.holder_height.toString() + "px"
            }
        },
        {
            type:"div", 
            id:"arena_online_image", 
            attach:"arena_online_main_div",
            style:{
                width: v.image_width.toString() + "px",
                height: v.image_height.toString() + "px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_Image.getImage({name:"text_connection_failed",w:v.image_width,h:v.image_height}) })`,
                backgroundSize:  v.image_width.toString() + "px" + " " +  v.image_height.toString() + "px"
            }
        },
        {
            type:"button", 
            id:"arena_online_button", 
            attach:"arena_online_main_div",
            style:{
                margin:v.margin,
                padding:"1%",
                width: v.button_width.toString() + "px",
                height: v.button_height.toString() + "px",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_Image.getImage({name:"button_continue",w:v.button_width,h:v.button_height}) })`,
                backgroundSize:  v.button_width.toString() + "px" + " " +  v.button_height.toString() + "px"
            },
            attrib:
            { 
                onclick:"ARENA_ONLINE_ErrorConnection.continue();"
            }
        },
    ]);

};

return f;}());var ARENA_Preparation = (function(){var f ={};

f.initialize = function()
{
    //Save current interface
    SYS_Data.game.current_interface = "arena_preparation";

    //Clear the interface first before adding anything
    SYS_UI.clear({id:SYS_UI.body});

    //Create the menu interface
    createInterface(SYS_UI.body);

    //Clear Data
    SYS_Data.arena_data = 
    { 
        connection:"",
        user_data:{},
        battledata:{},
        controls_data:
        {
            spell_selected:0
        },
    };
 
    //Prepare player data
    SYS_Data.arena_data.user_data = 
    {
        id:SYS_Utils.idGenerator(20),
        name:"Human Player",
        character:"character_01",
        blessing:"bl01",
        //The spell[0] is auto generated on the Server so no need to have
        //an spell_index for it. spell_indexes[0] is for spell[1] in the server
        //if an spell_indexes[i] value is 0 it does not mean sp00.
        spell_indexes:[0,1,2,3],
    };

};

f.controls = function(id)
{
    switch(id)
    {
        case "online":
            ARENA_ONLINE.initialize();
        break;

        case "offline":
            ARENA_OFFLINE.initialize();
        break;

        case "cancel":
            HOME_Start.initialize();
        break;

        default:
            alert(id + " does not exist ");
        break;
    };
};

function createInterface(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(SYS_Data.game.orientation === "portrait")
    {
        v.button_width = v.holder_width * 0.40;
        v.button_height = v.holder_height * 0.04;

        v.image_width = v.holder_width * 0.70;
        v.image_height = v.holder_height * 0.10;
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        v.button_width = v.holder_width * 0.25;
        v.button_height = v.holder_height * 0.06;

        v.image_width = v.holder_width * 0.45;
        v.image_height = v.holder_height * 0.15;
    };

    SYS_UI.create([
        {
            type:"div", 
            id:"arena_preparation_main_div", 
            attach:div_holder,
            style:{
                width: v.holder_width.toString() + "px",
                height: v.holder_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                background:"transparent",
                backgroundImage:`url( ${ DATA_Image.getImage({name:"game_background",w:v.holder_width,h:v.holder_height}) } )`,
                backgroundSize:  v.holder_width.toString() + "px" + " " +  v.holder_height.toString() + "px"
            }
        },
        {
            type:"div", 
            id:"arena_preparation_image", 
            attach:"arena_preparation_main_div",
            style:{
                width: v.image_width.toString() + "px",
                height: v.image_height.toString() + "px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_Image.getImage({name:"text_battle_loadout",w:v.image_width,h:v.image_height}) })`,
                backgroundSize:  v.image_width.toString() + "px" + " " +  v.image_height.toString() + "px"
            }
        },
        {
            type:"button", 
            id:"arena_preparation_button_01", 
            attach:"arena_preparation_main_div",
            style:{
                margin:"2%",
                padding:"1%",
                width: v.button_width.toString() + "px",
                height: v.button_height.toString() + "px",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_Image.getImage({name:"button_online",w:v.button_width,h:v.button_height}) } )`,
                backgroundSize:  v.button_width.toString() + "px" + " " +  v.button_height.toString() + "px"
            },
            attrib:
            { 
                onclick:"ARENA_Preparation.controls('online');"
            }
        },
        {
            type:"button", 
            id:"arena_preparation_button_02", 
            attach:"arena_preparation_main_div",
            style:{
                margin:"2%",
                padding:"1%",
                width: v.button_width.toString() + "px",
                height: v.button_height.toString() + "px",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_Image.getImage({name:"button_offline",w:v.button_width,h:v.button_height}) } )`,
                backgroundSize:  v.button_width.toString() + "px" + " " +  v.button_height.toString() + "px"
            },
            attrib:
            { 
                onclick:"ARENA_Preparation.controls('offline');"
            }
        },
        {
            type:"button", 
            id:"arena_preparation_button_03", 
            attach:"arena_preparation_main_div",
            style:{
                margin:"2%",
                padding:"1%",
                width: v.button_width.toString() + "px",
                height: v.button_height.toString() + "px",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_Image.getImage({name:"button_cancel",w:v.button_width,h:v.button_height}) } )`,
                backgroundSize:  v.button_width.toString() + "px" + " " +  v.button_height.toString() + "px"
            },
            attrib:
            { 
                onclick:"ARENA_Preparation.controls('cancel');"
            }
        },
    ]);

};

return f;}());var ARENA_Renderer = (function(){var f ={};

f.render_environment = function(player,canvas,ctx,battledata)
{
    if(player === "player1")
    {
        var p1_env = battledata.player1.environment;
        render(0,p1_env);
    }else{
        var p2_env = battledata.player2.environment;
        render(canvas.width / 2,p2_env);
    };


    function render(starting_position,env)
    {  
        var canvas_data = 
        {
            x:starting_position,
            y:0,
            w:canvas.width,
            h:canvas.height
        };

        var sprite_data = SYS_Sprite.get_sprite_data(`${env.name}_${env.tag}`);

        ctx.drawImage(
            sprite_data.image,
            sprite_data.data.x,
            sprite_data.data.y,
            sprite_data.data.w,
            sprite_data.data.h,
            canvas_data.x,
            canvas_data.y,
            canvas_data.w / 2,
            canvas_data.h
        )
    };
    
};

f.render_entity = function(canvas,ctx,entity)
{   
    if(typeof(entity.model) !== "undefined" && typeof(entity.physics) !== "undefined")
    {
        var sprite = entity.model.sprite;
        var animation = entity.model.animation;
        var size = entity.model.size;
        var position = entity.physics.position;
    
        var sprite_data = SYS_Sprite.get_sprite_data(`${sprite}_${animation.tag}_${animation.name}_${animation.frame_count}`);
        var canvas_based_position = getCanvasPosition(position,size,canvas);
        var canvas_based_size = getCanvasSize(size,canvas);
    
        //Draw the image
        ctx.drawImage(
            sprite_data.image,
            sprite_data.data.x,
            sprite_data.data.y,
            sprite_data.data.w,
            sprite_data.data.h,
            canvas_based_position.x,
            canvas_based_position.y,
            canvas_based_size.w,
            canvas_based_size.h
        );
    
        var debug = false;
        if(debug === true)
        {
            var canvas_based_col_position = getCanvasPosition(entity.physics.position,entity.physics.collision_size,canvas);
            var canvas_based_col_size = getCanvasSize(entity.physics.collision_size,canvas);
    
            ctx.lineWidth = "3";
            ctx.strokeStyle = "red";
            ctx.strokeRect(canvas_based_col_position.x, canvas_based_col_position.y, canvas_based_col_size.w, canvas_based_col_size.h);
        };
    };
}; 

function getCanvasPosition (position,size,canvas)
{
    var new_position = {x:0, y:0};
    new_position.x = canvas.width * (position.x / 100);
    new_position.y = canvas.height * (position.y / 100);

    var new_size = {w:0, h:0};
    new_size.w = canvas.width * (size.w / 100);
    new_size.h = canvas.height * (size.h/ 100);

    var canvas_position = {x:0, y:0};
    canvas_position.x = Math.abs(new_position.x - (new_size.w / 2));
    canvas_position.y = Math.abs(new_position.y - (new_size.h / 2));

    return canvas_position;
};

function getCanvasSize(size,canvas)
{
    var new_size = {w:0, h:0};
    new_size.w =  canvas.width * (size.w / 100);
    new_size.h =  canvas.height * (size.h / 100);

    return new_size;
};

return f;}());var ARENA_Result = (function(){var f ={};

f.initialize = function(result_data,user_data)
{
    //Save current interface
    SYS_Data.game.current_interface = "arena_result";

    //Clear the interface first before adding anything
    SYS_UI.clear({id:SYS_UI.body});

    //Create the menu interface
    createInterface(SYS_UI.body);

    
    //Detect if there is an error or the game is over
    if(typeof(result_data) !== "string")
    {
        var combat_result = detectResult(result_data,user_data);
        SYS_UI.style([
            {
                id:"result_image",
                backgroundImage:`url( ${ DATA_Image.getImage({name:combat_result,w:99999,h:9999}) })`
            }
        ])
    
    }
    else if(typeof(result_data) === "string")
    {
        SYS_UI.style([
            {
                id:"result_image",
                backgroundImage:`url( ${ DATA_Image.getImage({name:"result_draw",w:99999,h:9999}) })`
            }
        ])
    };

};

function createInterface(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(SYS_Data.game.orientation === "portrait")
    {
        v.image_width = v.holder_width * 0.70;
        v.image_height = v.holder_height * 0.10;

        v.button_width = v.holder_width * 0.40;
        v.button_height = v.holder_height * 0.04;

        v.margin = "20%";
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        v.image_width = v.holder_width * 0.45;
        v.image_height = v.holder_height * 0.15;

        v.button_width = v.holder_width * 0.25;
        v.button_height = v.holder_height * 0.06;

        v.margin = "10%"
    };

    SYS_UI.create([
        {
            type:"div", 
            id:"result_main_div", 
            attach:div_holder,
            style:{
                width: v.holder_width.toString() + "px",
                height: v.holder_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                background:"transparent",
                backgroundImage:`url( ${ DATA_Image.getImage({name:"game_background",w:v.holder_width,h:v.holder_height}) })`,
                backgroundSize:  v.holder_width.toString() + "px" + " " +  v.holder_height.toString() + "px"
            }
        },
        {
            type:"div", 
            id:"result_image", 
            attach:"result_main_div",
            style:{
                width: v.image_width.toString() + "px",
                height: v.image_height.toString() + "px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_Image.getImage({name:"default_image",w:v.image_width,h:v.image_height}) })`,
                backgroundSize:  v.image_width.toString() + "px" + " " +  v.image_height.toString() + "px"
            }
        },
        {
            type:"button", 
            id:"result_button", 
            attach:"result_main_div",
            style:{
                margin:v.margin,
                padding:"1%",
                width: v.button_width.toString() + "px",
                height: v.button_height.toString() + "px",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_Image.getImage({name:"button_continue",w:v.button_width,h:v.button_height}) })`,
                backgroundSize:  v.button_width.toString() + "px" + " " +  v.button_height.toString() + "px"
            },
            attrib:
            { 
                onclick:"ARENA_Preparation.initialize();"
            }
        },
    ]);

};

function detectResult(result_data,user_data)
{
    if(user_data.id === result_data.player1.id)
    {
        var player = "player1";
    }
    else if(user_data.id === result_data.player2.id)
    {
        var player = "player2";
    };

    if(player === result_data.core.winner)
    {
        return "text_victory";
    }
    if(player !== result_data.core.winner)
    {
        if(result_data.core.winner === "draw")
        {
            return "text_draw";
        }
        else
        {
            return "text_defeat";
        };
    };
};

return f;}());var BLESSING_00 = (function(){var f ={};

f.getStats = function()
{
    var stats =
    {
        health:100,
        health_max:100,
        energy:100,
        energy_max:100,
        energy_regen:10,
        intelligence:0,
    };

    return stats;
};

f.getSpellStats = function(spell_indexes)
{
    // --------------- R E M E M B E R -------------------
    //Although spell_indexes has only 4 index the spell 
    //needs 5 indexes. because spell[0] is used when the Player 
    //doesn't press any Spell Button. and spell[1] to spell[4]
    //corresponds to the Player Spells.
    //-----------------------------------------------------

    //spells[0] is required to be sp00
    var spells = ["sp00"];

    spell_indexes.forEach(function(spell_index)
    {
        //BL00 is a special case because no matter the
        //index it will always be sp00
        spells.push("sp00");
    });

    return SPELLS.getSpellStats(spells);
};

return f;}());var BLESSING_01 = (function(){var f ={};

f.getStats = function()
{
    var stats =
    {
        health:500,
        health_max:500,
        energy:500,
        energy_max:500,
        energy_regen:10,
        intelligence:100,
    };

    return stats;
};

f.getSpellStats = function(spell_indexes)
{
    // --------------- R E M E M B E R -------------------
    //Although spell_indexes has only 4 index the spell 
    //needs 5 indexes. because spell[0] is used when the Player 
    //doesn't press any Spell Button. and spell[1] to spell[4]
    //corresponds to the Player Spells.
    //-----------------------------------------------------

    //Available spells for this blessing. sp00 is not allowed here
    var spell_list = ["sp01","sp02","sp03","sp04"];

    //spells[0] is required to be sp00
    var spells = ["sp00"];

    spell_indexes.forEach(function(spell_index)
    {
        spells.push(spell_list[spell_index]);
    });

    return SPELLS.getSpellStats(spells);

};

return f;}());var CHARACTER_01 = (function(){var f ={};

const animation_database =
{
    idle: { max_frame:1 , max_speed:10, run_once:false },
    run: { max_frame:3 , max_speed:10, run_once:false },
    attack: { max_frame:3, max_speed:10, run_once:true }
};

f.environment = function(player)
{
    var data = 
    {
        "player1":{name:"environment_default", tag:"both"},
        "player2":{name:"environment_default", tag:"both"},   
    };

    var new_environment = 
    {
       name:data[player].name,
       tag:data[player].tag
    };

    return new_environment;
};

f.create = function(player_owner,battledata)
{
    var ground_height = battledata.private.environment.ground_height;
    var back_position = battledata.private.environment.back_position;

    if(player_owner === "player1")
    {
        var init_animation_tag = "left";
        var init_animation_name = "idle";
        var init_size = {w:12, h:15};
        var init_position = {x:back_position["player1"], y:ground_height-(init_size.h * 0.40)};
        var init_border_limit = { x:{min:0, max:50}, y:{min:0, max:ground_height} };
    }
    else if(player_owner === "player2")
    {
        var init_animation_tag = "right";
        var init_animation_name = "idle";
        var init_size = {w:12, h:15};
        var init_position = {x:back_position["player2"], y:ground_height-(init_size.h * 0.40) };
        var init_border_limit = { x:{min:51, max:100}, y:ground_height};
    };

    var new_character = 
    {
        info:
        {
            id:ENGINE_Utils.idGenerator(20),
            name: "character_01",
            class: "character",
            subclass: "character",  //used for collision targeting
            owner:player_owner
        },
        model:
        {
            sprite: "character_01",
            size: {w:init_size.w, h:init_size.h+2},
            animation:
            {
                tag: init_animation_tag,
                name: init_animation_name,
                frame_count:0,
                speed_count:0,
                run_once_animations:[]
            }
        },
        physics:
        {
            target_position: init_position,//Used when the character is moving. REFER TO PHASE_1
            old_position:{},//Dont remove this stat
            position: init_position,
            move_speed: 20,
            move_angle: -1, //-1 means movement disabled
            collision_size: init_size,
            border_limit: init_border_limit,
            has_border_limit: true,
            has_reached_border_limit:false,
        }
    };

    return new_character;
};

f.update = function(action,entity,battledata)
{   
    if(action === "run")
    {   
        entity = ENGINE_Animation.animate("run",animation_database,entity);
    };

    if(action === "idle")
    {   
        entity = ENGINE_Animation.animate("idle",animation_database,entity);
    };

    if(action === "attack")
    {   
        entity = ENGINE_Animation.animate("attack",animation_database,entity);
    };
    
    return entity;
};

return f;}());var DATA_Blessings = (function(){var f ={};

var blessing_data = 
{
    "bl00":
    {
        image:"././media/images/others/default_icon.png",
        spell_list: [] //All 18 spells are sp00
    },

    "bl01":
    {
        image:"././media/images/icons/spells/atomic-slashes.png",
        spell_list: ["sp01","sp02","sp03","sp04"] //Max 18 spells. sp00 means none so dont include it
    },
};

f.getData = function(blessing_id,blessing_target_data)
{
    return blessing_data[blessing_id][blessing_target_data];
};

return f;}());var DATA_Image = (function(){var f ={};

f.getImage = function(param)
{   
    var link = "";

    switch(param.name)
    {
        case "game_background":
            if(param.w <= 99999 && param.h <= 99999)
            {
                link =  "././media/images/ui/game_background.jpg";
            };
        break;

        case "button_arena":
            if(param.w <= 99999 && param.h <= 99999)
            {
                link =  "././media/images/ui/button_arena.png";
            };
        break;

        case "button_online":
            if(param.w <= 99999 && param.h <= 99999)
            {
                link =  "././media/images/ui/button_online.png";
            };
        break;

        case "button_offline":
            if(param.w <= 99999 && param.h <= 99999)
            {
                link =  "././media/images/ui/button_offline.png";
            };
        break;

        case "button_cancel":
            if(param.w <= 99999 && param.h <= 99999)
            {
                link =  "././media/images/ui/button_cancel.png";
            };
        break;

        case "button_continue":
            if(param.w <= 99999 && param.h <= 99999)
            {
                link =  "././media/images/ui/button_continue.png";
            };
        break;

        case "text_battle_loadout":
            if(param.w <= 99999 && param.h <= 99999)
            {
                link =  "././media/images/ui/text_battle_loadout.png";
            };
        break;

        case "text_connecting":
            if(param.w <= 99999 && param.h <= 99999)
            {
                link =  "././media/images/ui/text_connecting.png";
            };
        break;

        case "text_connection_failed":
            if(param.w <= 99999 && param.h <= 99999)
            {
                link =  "././media/images/ui/text_connection_failed.png";
            };
        break;

        case "text_victory":
            if(param.w <= 99999 && param.h <= 99999)
            {
                link =  "././media/images/ui/text_victory.png";
            };
        break;

        case "text_defeat":
            if(param.w <= 99999 && param.h <= 99999)
            {
                link =  "././media/images/ui/text_defeat.png";
            };
        break;

        case "text_draw":
            if(param.w <= 99999 && param.h <= 99999)
            {
                link =  "././media/images/ui/text_draw.png";
            };
        break;

        case "default":
            link =  "././media/images/others/default_icon.png";
        break;

        default:
            link =  "././media/images/others/default_icon.png";
        break;
    }

    return link;
};

return f;}());var DATA_Spells = (function(){var f ={};

var spell_data = 
{
    "sp00":
    {
        image:"././media/images/others/default_icon.png"
    },

    "sp01":
    {
        image:"././media/images/icons/spells/atomic-slashes.png"
    },

    "sp02":
    {
        image:"././media/images/icons/spells/abstract-013.png"
    },

    "sp03":
    {
        image:"././media/images/icons/spells/laser-precision.png"
    },

    "sp04":
    {
        image:"././media/images/icons/spells/heavy-rain.png"
    },


};

f.getData = function(spell_id,spell_target_data)
{
    return spell_data[spell_id][spell_target_data];
};

return f;}());var ENGINE_Animation = (function(){var f ={};

f.animate = function(current_animation,animation_database,entity,)
{
    var entity_animation = entity.model.animation;
    
    if(current_animation != entity_animation.name)
    {
        entity_animation.frame_count = 0;
        entity_animation.speed_count = 0;
        entity_animation.name = current_animation;
    };
   
    if(entity_animation.speed_count < animation_database[entity_animation.name].max_speed)
    {
        entity_animation.speed_count++;
    }
    else if(entity_animation.speed_count >= animation_database[entity_animation.name].max_speed)
    {
        entity_animation.speed_count = 0;

        if(entity_animation.frame_count < animation_database[entity_animation.name].max_frame - 1)
        {
            entity_animation.frame_count++;
        }
        else if(entity_animation.frame_count >= animation_database[entity_animation.name].max_frame - 1)
        {
            if(animation_database[entity_animation.name].run_once === false)
            {
                entity_animation.frame_count = 0;
            }
            else if(animation_database[entity_animation.name].run_once === true)
            {
                if(entity_animation.run_once_animations.indexOf(entity_animation.name) < 0)
                {
                    entity_animation.run_once_animations.push(entity_animation.name);
                };
            };
        };
    };

    return entity;
};

return f;}());var ENGINE_Battledata = (function(){var f ={};

f.generate = function(player1_data,player2_data)
{
    var battledata = 
    {   
        core:
        {
            status:"ongoing",
            winner:"none",

            //The following data are updated at PHASE_Waiting.initializePhase();
            round_count:0,
            round_timer:0,

            //The objects that will be rendered on canvas
            entiies:[]
        },
        player1:
        {
            id: player1_data.id,
            name: player1_data.name,
            character: player1_data.character,
            blessing:player1_data.blessing,
            spells: ENGINE_Utils.copyObject(BLESSINGS.getSpellStats(player1_data.blessing,player1_data.spell_indexes)),
            environment: ENGINE_Utils.copyObject(CHARACTERS.getEnvironment(player1_data.character,"player1")),
            stats: ENGINE_Utils.copyObject(BLESSINGS.getInitialStats(player1_data.blessing)),
            selected_spell: 0,
            status:[],
        },
        player2:
        {
            id: player2_data.id,
            name: player2_data.name,
            character: player2_data.character,
            blessing:player2_data.blessing,
            spells: ENGINE_Utils.copyObject(BLESSINGS.getSpellStats(player2_data.blessing,player2_data.spell_indexes)),
            environment: ENGINE_Utils.copyObject(CHARACTERS.getEnvironment(player2_data.character,"player2")),
            stats: ENGINE_Utils.copyObject( BLESSINGS.getInitialStats(player2_data.blessing) ),
            selected_spell:0,
            status:[],
        },
        private:
        {
            core:
            {
                initialized:false,
                time:0,
                gameover_removal_countdown:0,
                round_timer_max:10,
                gameover_timer:200, //Default value
                //Used in physics engine
                delta_time_previous_time:Date.now(),
                delta_time:0,
                max_status_number:6,

            },
            environment:
            {
                flying_height: 33,
                ground_height: 66,
                back_position: {player1:15, player2:85},
                front_position:{player1:35, player2: 75}     
            },  
            phases:
            {
                stage:0,
                initialized: false,
            },
            player1:
            {
                succesful_cast:false,
                current_spell_selected:0,
            },
            player2:
            {
                succesful_cast:false,
                current_spell_selected:0,
            }
        }

    };

    return battledata;

};

return f;}());var ENGINE_Combat = (function(){var f ={};

f.playerCombat = function(battledata,source_player,target_player,source_entity)
{
    if(source_player === "player1")
    {
        var source_player_data = battledata.player1;
        var target_player_data = battledata.player2;
    }
    else if(source_player === "player2")
    {
        var source_player_data = battledata.player2;
        var target_player_data = battledata.player1;
    };

    target_player_data.stats.health = target_player_data.stats.health - source_entity.combat.damage;

    return battledata;
};

f.detectBattleStatus = function(battledata)
{
    if(battledata.player1.stats.health <= 0 && battledata.player2.stats.health >= 1)
    {
        battledata.core.status = "battleover";
        battledata.core.winner = "player2";
    }
    else if(battledata.player2.stats.health <= 0 && battledata.player1.stats.health >= 1)
    {
        battledata.core.status = "battleover";
        battledata.core.winner = "player1";
    }
    else if(battledata.player2.stats.health <= 0 && battledata.player1.stats.health <= 0)
    {
        battledata.core.status = "battleover";
        battledata.core.winner = "draw";
    }
    else if(battledata.player2.stats.health >= 1 && battledata.player1.stats.health >= 1)
    {
        battledata.core.status = "ongoing";
        battledata.core.winner = "none";
    };
    
    return battledata;
};


return f;}());var ENGINE_Core_Gate = (function(){var f ={};

f.check = function(player_id)
{
    //The check simply means check if the battledata exist
    //for the player. If it exist it means we need to
    //return the new battledata with restricted information
    //if none then no return at all;

    var battledata_all = ENGINE_Core_Run.battledata_all;
    var the_result = "none";

    for(var i = 0; i <= battledata_all.length - 1;i++)
    {
        if(battledata_all[i].player1.id === player_id || battledata_all[i].player2.id === player_id)
        {
            //The following data are only allowed to be shared to all players
            if(player_id === battledata_all[i].player1.id )
            {
                the_result = createNewData("player1","player2",battledata_all[i]);
            }
            else if(player_id === battledata_all[i].player2.id)
            {
                the_result = createNewData("player2","player1",battledata_all[i]);
            };

            break;
        };
    };

    return the_result;

    function createNewData(player,opponent,battledata)
    {
        //Set the public data to be send to any players
        var new_battledata = 
        {
            core:battledata.core,
            player1:{},
            player2:{},
        }

        new_battledata[player] = battledata[player];

        new_battledata[opponent] =
        {
            name: battledata[opponent].name,
            environment:battledata[opponent].environment,
            blessing:battledata[opponent].blessing,
            status:battledata[opponent].status,
            stats:
            {
                health: battledata[opponent].stats.health,
                health_max: battledata[opponent].stats.health_max,
                energy: battledata[opponent].stats.energy,
                energy_max: battledata[opponent].stats.energy_max,
            }
        };

        return new_battledata;
    };

};

f.update = function(player_id,controls_data)
{
    var battledata_all = ENGINE_Core_Run.battledata_all;

    for(var i = 0; i <= battledata_all.length - 1;i++)
    {
        //Update secret data for Player 1
        if(player_id === battledata_all[i].player1.id)
        {
            battledata_all[i].private.player1.current_spell_selected = controls_data.spell_selected;
        };

        //Update secret data for Player 2
        if(player_id === battledata_all[i].player2.id)
        {
            battledata_all[i].private.player2.current_spell_selected = controls_data.spell_selected;
        };
    };
};

f.add = function(battledata)
{
    ENGINE_Core_Run.battledata_all.push(ENGINE_Utils.copyObject(battledata));
};

//-------------------------------------------------------------------------------------
//============================== OFFLINE FEATURES ONLY ================================
//-------------------------------------------------------------------------------------

f.pause = function(player_id)
{
    //This feature is only available for offline mode
    //This happens automatically when you open the options interface
    var battledata_all = ENGINE_Core_Run.battledata_all;
    
    for(var i = 0; i <= battledata_all.length - 1;i++)
    {
        if(battledata_all[i].player1.id === player_id || battledata_all[i].player2.id === player_id)
        {
            if(battledata_all[i].core.status === "ongoing")
            {
                battledata_all[i].core.status = "pause";
            };
        }
    };
};

f.unpause = function(player_id)
{
    //This feature is only available for offline mode
    //This happens automatically when you open the options interface
    var battledata_all = ENGINE_Core_Run.battledata_all;

    for(var i = 0; i <= battledata_all.length - 1;i++)
    {
        if(battledata_all[i].player1.id === player_id || battledata_all[i].player2.id === player_id)
        {
            if(battledata_all[i].core.status === "pause")
            {
                battledata_all[i].core.status = "ongoing";
            };
        }
    };
};


return f;}());var ENGINE_Core_Run = (function(){var f ={};

f.battledata_all = [];

f.initialize = function()
{
    //Start updating all the battledata
    setInterval(function()
    {
        if(f.battledata_all.length >= 1)
        {
            var new_battledata_all = [];
            var new_battledata;
    
            for(var i = 0; i <= f.battledata_all.length - 1;i++)
            {
                if(f.battledata_all[i].core.status !== "gameover")
                {
                    new_battledata = run(f.battledata_all[i]);
                    new_battledata_all.push(new_battledata);
                }
                else if(f.battledata_all[i].core.status === "gameover")
                {
                    //In this part we will check if the battledata is gameover
                    //then lets add a cycle countdown before we remove it.
                    f.battledata_all[i].private.gameover_removal_countdown++;

                    if(f.battledata_all[i].private.gameover_removal_countdown <= 1000)
                    {
                        new_battledata_all.push(f.battledata_all[i]);
                    };
                };
            };
            f.battledata_all = new_battledata_all;
        };

    },10);

};

function run(battledata)
{
    //REMEMBER Delta Time should only be stopped at gameover
    //Other game status can't pause the delta time to prevent
    //any physics bugs. 
    if(battledata.core.status !== "gameover")
    {
        var current_time = Date.now();
        var delta_time = current_time - battledata.private.core.delta_time_previous_time;
        battledata.private.core.delta_time_previous_time = current_time;
        battledata.private.core.delta_time = delta_time / 1000;

        //When the user changes to another tab or
        //the window is not focused/visible then 
        //the delta time increases so much that is 
        //why we limit it to a certain degree.
        if(battledata.private.core.delta_time >= 0.08)
        {
            battledata.private.core.delta_time = 0.08;
        };
    };

    if(battledata.core.status === "ongoing")
    {
        //Update time
        //Every point equals to 10 milliseconds
        battledata.private.core.time++;

        //INITIALIZE
        if(battledata.private.core.time <= 10 && battledata.private.core.initialized === false)
        {
            battledata.private.core.initialized = true;

            //CREATE PLAYER CHARACTERS
            battledata.core.entities = [];
            battledata.core.entities.push(ENGINE_Utils.copyObject(CHARACTERS.create("player1",battledata.player1.character,battledata)));
            battledata.core.entities.push(ENGINE_Utils.copyObject(CHARACTERS.create("player2",battledata.player2.character,battledata)));
        
            //INITIALIZE PHASES
            battledata = PHASES.initialize(battledata);
        };

        //UPDATE PHASES
        battledata = PHASES.update(battledata);

    }
    //The BATTLEOVER status is determined at PHASE_Casting.updatePhase()
    else if(battledata.core.status === "battleover")
    {
        battledata.private.core.gameover_timer--;

        if(battledata.private.core.gameover_timer <= 0)
        {
            battledata.core.status = "gameover";
        };
    };

    return battledata
};


return f;}());var ENGINE_Entity = (function(){var f ={};

f.deleteEntity = function(source_entity,battledata)
{ 
    var new_entities = [];

    battledata.core.entities.forEach(function(entity)
    {
        if(Object.keys(entity).length >= 1)
        {
            if(source_entity.info.id !== entity.info.id)
            {
                new_entities.push(entity);
            };
        };
    });

    battledata.core.entities = new_entities;
    return battledata;
};

f.getCharacter = function(player,battledata)
{ 
    var character;

    battledata.core.entities.forEach(function(entity)
    {
        if(Object.keys(entity).length >= 1)
        {
            if(entity.info.owner === player && entity.info.class === "character")
            {
               character = entity; 
            };
        }
    });

    return character;
};

f.getNonCharacterCount = function(battledata)
{
    var non_character_entity = 0;

    for(var i = 0; i <= battledata.core.entities.length - 1;i++)
    {  
        if(Object.keys(battledata.core.entities[i]).length >= 1)
        {
            if(battledata.core.entities[i].info.class !== "character")
            {
                non_character_entity++;
            };
        }
    };

    return non_character_entity;
};

f.updateCharacter = function(params)
{
    var battledata = params.battledata;
    var mode = params.mode;
    var player = params.player;
    var the_entity;

    for(var i = 0; i <= battledata.core.entities.length - 1;i++)
    {   
        the_entity = battledata.core.entities[i];

        if(Object.keys(the_entity).length >= 1)
        {
            if(the_entity.info.class === "character")
            {
                switch(mode)
                {   
                    case "reset_run_once_animation":
                        the_entity.model.animation.run_once_animations = [];
                    break;
                    
                    case "attack":
                        if(the_entity.info.owner === player)
                        {
                            //The RUN ONCE ANIMATIONS are reset at PHASE_Casting.initializePhase();
                            if(the_entity.model.animation.run_once_animations.indexOf("attack") < 0)
                            {
                                the_entity = CHARACTERS.update("attack",the_entity,battledata);
                            }
                            else
                            {   
                                the_entity = CHARACTERS.update("idle",the_entity,battledata);
                            };
                        };
                    break;

                    case "move":
                        the_entity = CHARACTERS.update("moving",the_entity,battledata);
                    break;

                    case "idle":
                        the_entity = CHARACTERS.update("idle",the_entity,battledata);
                    break;
                };

            };
        };
    };

    return battledata;
};

f.characterTargetDistance = function(player,battledata)
{
    for(var i = 0; i <= battledata.core.entities.length - 1;i++)
    {   
        the_entity = battledata.core.entities[i];

        if(Object.keys(the_entity).length >= 1)
        {
            if(the_entity.info.class === "character")
            {
               if(the_entity.info.owner === player)
               {
                    return ENGINE_Physics.getDistanceBetweenPoints(the_entity.physics.target_position,the_entity.physics.position);
               };
            };
        };
    };
};


f.genericUpdate = function(battledata)
{
    var the_entity;

    //Update every entity
    for(var i = 0; i <= battledata.core.entities.length - 1;i++)
    {  
        the_entity = battledata.core.entities[i];

        if(Object.keys(the_entity).length >= 1)
        {
            switch(the_entity.info.class)
            {
                case "spell":
                    battledata = SPELLS.genericUpdate(the_entity,battledata);
                break;

                case "sfx":
                    battledata = SFX.genericUpdate(the_entity,battledata);
                break;
            };
        };
    };    

    return battledata;
};


return f;}());var ENGINE_Matchmaking = (function(){var f ={};

f.matchdata_all = [];

f.initialize = function()
{
    //Start updating all the battledata
    setInterval(function()
    {
        matchmake();
    },10);

};

f.join = function(joining_data)
{   
    var number_of_same_player = 0;
    f.matchdata_all.forEach(function(player)
    {
        if(player.user_data.id === joining_data.id)
        {
            number_of_same_player++;
        };
    });
    
    if(number_of_same_player === 0)
    {   
        var new_data = 
        {
            matched:false,
            canceled:false,
            user_data:joining_data
        };
        f.matchdata_all.push(new_data);
    };
};

f.cancel = function(player_id)
{
    for(var m = 0; m <= f.matchdata_all.length - 1;m++)
    {
        if(f.matchdata_all[m].user_data.id === player_id)
        {
            f.matchdata_all[m].canceled = true;
            break;
        };
    };
};

function matchmake()
{
    var player_count = 0;
    var player1_data = {};
    var player2_data = {};

    //Get the first player
    for(var m1 = 0; m1 <= f.matchdata_all.length - 1;m1++)
    {
        if(f.matchdata_all[m1].matched === false && f.matchdata_all[m1].canceled === false)
        {
            player_count++;
            player1_data = f.matchdata_all[m1].user_data;
            break;
        };
    };

    //Get the second player
    for(var m2 = 0; m2 <= f.matchdata_all.length - 1;m2++)
    {
        if(f.matchdata_all[m2].matched === false && f.matchdata_all[m2].canceled === false)
        {
            if(f.matchdata_all[m2].user_data.id !== player1_data.id)
            {
                player_count++;
                player2_data = f.matchdata_all[m2].user_data;
                break;
            };
        };
    };

    //Now lets start the battle;
    if(player_count === 2)
    {   
        var battledata = ENGINE_Battledata.generate(player1_data,player2_data);

        ENGINE_Core_Gate.add(battledata);

        f.matchdata_all.forEach(function(player)
        {
            if(player.user_data.id === player1_data.id || player.user_data.id === player2_data.id)
            {
               player.matched = true;
            };
        });
    };

};


return f;}());var ENGINE_Offline_LocalStorage = (function(){var f ={};

//This is OFFLINE SERVER FEATURE only
//Since there is no LOCAL STORAGE for online server
//That is why we need to activate this on CLIENT.

var localstorage_enabled = true;
var localstorage_id = "mduel_offline_server"
var localstorage_version = "2";

f.initialize = function()
{
    //Load Local Storage Data
    f.load();

    //Periodically save game data
    setInterval(f.save,100);
};

f.load = function()
{
    if(localstorage_enabled === true)
    {   
        var data = JSON.parse(window.localStorage.getItem(localstorage_id));
        
        if(data !== null)
        {
            if(data.version !== null || typeof(data.version) !== "undefined"){
    
                if(data.version !== localstorage_version){
                    window.localStorage.removeItem(localstorage_id);
                }else{
                    ENGINE_Core_Run.battledata_all = data.battledata_all;
                    ENGINE_Matchmaking.matchdata_all = data.matchdata_all;
                };
    
            }else{
                window.localStorage.removeItem(SYS_Data.game.localstorage_id);
            };
        };
    }
    else
    {
        window.localStorage.clear();
    };

};

f.save = function()
{
    if(SYS_Data.game.localstorage_enabled === true)
    {
        var data = 
        {
            version:localstorage_version,
            battledata_all:ENGINE_Core_Run.battledata_all,
            matchdata_all:ENGINE_Matchmaking.matchdata_all
        };

        window.localStorage.setItem(localstorage_id,JSON.stringify(data));
    }
    else
    {
        window.localStorage.clear();
    };

};


return f;}());var ENGINE_Physics = (function(){var f ={};

f.updatePosition = function(target_entity,delta_time)
{
    if(target_entity.physics.move_angle >= 0 && target_entity.physics.move_angle <= 360)
    {
        var new_position = f.newPosition(target_entity.physics.position,target_entity.physics.move_speed,target_entity.physics.move_angle,delta_time);
    }
    else
    {
        var new_position = target_entity.physics.position;
    };
   
    if(target_entity.physics.has_border_limit === true)
    {
        var result = f.applyBorderLimit(new_position,target_entity.physics.collision_size,target_entity.physics.border_limit);

        target_entity.physics.has_reached_border_limit = result.has_reached_border_limit;

        if(result.has_reached_border_limit === true)
        {
            new_position = target_entity.physics.position;
        };
    };
    
    target_entity.physics.old_position = ENGINE_Utils.copyObject(target_entity.physics.position);
    target_entity.physics.position = new_position;

    return target_entity;
};

f.newPosition = function(position,move_speed,move_angle,delta_time)
{   
    var new_position = {x:0, y:0};
    var radians = (move_angle * Math.PI) / 180;

    new_position.x = position.x - ((Math.cos(radians) * move_speed) * delta_time);
    new_position.y = position.y - ((Math.sin(radians) * move_speed) * delta_time);

    return new_position;
};

f.applyBorderLimit = function(position,collision_size,border_limit)
{   
    var new_position = ENGINE_Utils.copyObject(position);
    var position_limit = { x:{ min:0, max:0 }, y: { min:0 , max:0 } };
    var has_reached_border_limit = false;

    position_limit.x.min = position.x - Math.floor(collision_size.w / 2);
    position_limit.x.max = position.x + Math.floor(collision_size.w / 2);

    position_limit.y.min = position.y - Math.floor(collision_size.h / 2);
    position_limit.y.max = position.y + Math.floor(collision_size.h / 2);

    if(position_limit.x.min <= border_limit.x.min)
    {
        new_position.x = border_limit.x.min + collision_size.w / 2; 
        has_reached_border_limit = true;
    };

    if(position_limit.x.max >= border_limit.x.max)
    {   
        new_position.x = border_limit.x.max - collision_size.w / 2; 
        has_reached_border_limit = true;
    };

    if(position_limit.y.min <= border_limit.y.min)
    {
        new_position.y = border_limit.y.min + collision_size.h / 2; 
        has_reached_border_limit = true;
    };

    if(position_limit.y.max >= border_limit.y.max)
    {
        new_position.y = border_limit.y.max - collision_size.h / 2; 
        has_reached_border_limit = true;
    };
    
    return {
        position:new_position,
        has_reached_border_limit:has_reached_border_limit
    };

};

f.getColliders = function(source_entity,battledata,target_subclass)
{
    var collided_objects = [];

    battledata.core.entities.forEach(function(entity)
    {
        if(Object.keys(entity).length >= 1)
        {
            if(source_entity.info.id !== entity.info.id)
            {
                if(target_subclass.indexOf(entity.info.subclass) >= 0)
                {   
                    if(entity.info.owner !== source_entity.info.owner)
                    {
                        if(f.detectCollision(source_entity,entity) === true)
                        {
                            collided_objects.push(entity);
                        };
                    };
                };
            };
        };
    }); 

    return collided_objects;
};

f.detectCollision = function(source_entity,target_entity)
{
    var collision_range = 0.40;//This is the minimum range;
    var distance = f.getDistanceBetweenPoints(source_entity.physics.position,target_entity.physics.position);
    var x_limit_distance = (source_entity.physics.collision_size.w * collision_range) + (target_entity.physics.collision_size.w * collision_range);
    var y_limit_distance = (source_entity.physics.collision_size.h * collision_range) + (target_entity.physics.collision_size.h * collision_range);

    if(distance.x <= x_limit_distance && distance.y <= y_limit_distance)
    {
       return true;
    };

   return false;
};

f.getDistanceBetweenPoints = function(source_position,target_position)
{
    var sx = source_position.x; var sy = source_position.y;
    var tx = target_position.x; var ty = target_position.y;

    var x_distance = tx - sx; var y_distance = ty - sy;

    return {
        x: Math.sqrt(Math.pow(x_distance,2) + Math.pow(0,2)),
        y: Math.sqrt(Math.pow(0,2) + Math.pow(y_distance,2)),
        total: Math.sqrt(Math.pow(x_distance,2) + Math.pow(y_distance,2))
    };

};

f.getAngleBetweenPoints = function(source_position,target_position) 
{
    var dy = target_position.y - source_position.y;
    var dx = target_position.x - source_position.x;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    return Math.floor(theta + 180);
}


return f;}());var ENGINE_PlayerActions = (function(){var f ={};

/*
    PlayerActions collects all possible player actions 
    that can be affected by status effects
    so that the effects can be easily applied
*/

f.regenerateEnergy = function(battledata)
{
    var p1_stats = battledata.player1.stats;
    var p2_stats = battledata.player2.stats;

    if(p1_stats.energy < p1_stats.energy_max)
    {
        p1_stats.energy = p1_stats.energy + p1_stats.energy_regen;
    };

    if(p2_stats.energy < p2_stats.energy_max)
    {
        p2_stats.energy = p2_stats.energy + p2_stats.energy_regen;
    };

    return battledata;
};

f.castSpell = function(battledata)
{   
    //Now check speed to see who will cast
    var p1 = battledata.player1;
    var p2 = battledata.player2;

    var p1_speed = SPELLS.getSpellSpeed(p1.spells[p1.selected_spell].id,"player1",battledata );
    var p2_speed = SPELLS.getSpellSpeed(p2.spells[p2.selected_spell].id,"player2",battledata );

    if(p1_speed > p2_speed){ cast("player1"); cast("player2"); }
    else if(p2_speed > p1_speed){ cast("player2"); cast("player1"); }
    else if(p1_speed === p2_speed)
    { 
        if(ENGINE_Utils.rng(1,100) <= 50){ cast("player1"); cast("player2"); }
        else{ cast("player2"); cast("player1"); };
    };

    function cast(player_tag)
    {
        var player = battledata[player_tag];

        if(player.spells[player.selected_spell].energy_cost <=  player.stats.energy && player.selected_spell >= 1)
        {
            battledata.private[player_tag].succesful_cast = true;
            player.stats.energy = player.stats.energy - player.spells[player.selected_spell].energy_cost;
            battledata = SPELLS.start(player_tag,player.spells[player.selected_spell].id,battledata);
        }
        else
        {
            battledata.private[player_tag].succesful_cast = false;
        };
    };

    return battledata;
};

f.castStatus = function(status_type,battledata)
{
    var p1 = battledata.player1;
    var p2 = battledata.player2;

    if(p1.stats.cast_speed > p2.stats.cast_speed)
    { 
        activate_status("player1","player2");
        activate_status("player2","player1"); 
    }
    else if(p2.stats.cast_speed > p1.stats.cast_speed)
    { 
        activate_status("player2","player1"); 
        activate_status("player1","player2"); 
    }
    else if(p1.stats.cast_speed === p2.stats.cast_speed)
    { 
        if(ENGINE_Utils.rng(1,100) <= 50)
        { 
            activate_status("player1","player2");
            activate_status("player2","player1");
        }
        else
        { 
            activate_status("player2","player1");
            activate_status("player1","player2");
        };
    };

    //Remove statuses with 0 stacks;
    battledata = refresh_status("player1",battledata);
    battledata = refresh_status("player2",battledata);

    return battledata;
    
    function activate_status(first_player,second_player)
    {
        battledata[first_player].status.forEach(function(status)
        {
            if(status.type === status_type && status.speed_condition === "fastest" && status.stacks >= 1)
            {
                battledata = STATUS.activateStatus(status.name,first_player,battledata);
            };
        });

        battledata[second_player].status.forEach(function(status)
        {
            if(status.type === status_type && status.speed_condition === "slowest" && status.stacks >= 1)
            {
                battledata = STATUS.activateStatus(status.name,second_player,battledata);
            };
        });
    };

    function refresh_status(player,battledata)
    {
        var new_statuses = [];

        battledata[player].status.forEach(function(status)
        {
            if(status.stacks >= 1)
            {
                new_statuses.push(status);
            };
        });

        battledata[player].status = new_statuses;

        return battledata;
    };

};

return f;}());var ENGINE_Utils = (function(){var f ={};

f.copyArray = function(target_array)
{
    //THIS FUNCTION DOES NOT MUTATE/AFFECT THE TARGET ARRAY AND CREATE A NEW INSTANCE OF NEW ARRAY
    var new_array = [];
    
    new_array = target_array.map(function(target_data){
       if(typeof(target_data) !== 'object'){
           return target_data;
       }else if(typeof(target_data) === 'object'){
           var new_target_array = [];
           try{ new_target_array = f.copy_array(target_data);  }catch(e){return target_data;};
           return new_target_array;
       };
        
    });
       
    return new_array;
};

f.copyObject = function(target_object)
{
    if(typeof(target_object) === "string")
    {
        //In case the target object used JSON.stringify
        return JSON.parse(target_object);
    }
    else 
    {
        return JSON.parse(JSON.stringify(target_object));
    }
};

f.rng = function(min,max)
{
    var max2 = max + 1;
    var rng_value = Math.floor(Math.random() * Math.floor(max2));
    if(rng_value < min){rng_value = min;};
    return rng_value;
};

f.idGenerator = function(id_length)
{
        var all_characters = ["0","1","2","3","4","5","6","7","8","9","Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Z","X","C","V","B","N","M"];
        var full_id = "";
        var randnumber = 0;
        while(id_length > 0){
           id_length--;
           randnumber = f.rng(1,all_characters.length);
           full_id = full_id.concat(all_characters[randnumber-1]);
        };
        return full_id;
};

f.getEnemyPlayer = function(player)
{
    if(player === "player1")
    {
        return "player2"
    }
    else if(player === "player2")
    {
        return "player1";
    };
};

return f;}());var HOME_Start = (function(){var f ={};

f.initialize = function()
{
    //Save current interface
    SYS_Data.game.current_interface = "home_start";

    //Clear the interface first before adding anything
    SYS_UI.clear({id:SYS_UI.body});

    //Create the menu interface
    createInterface(SYS_UI.body);

};

f.controls = function(id)
{
    switch(id)
    {
        case "arena":
            ARENA_Preparation.initialize();
        break;

        default:
          HOME_Start.initialize();  
        break;
    };
};

function createInterface(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(SYS_Data.game.orientation === "portrait")
    {
        v.button_width = v.holder_width * 0.40;
        v.button_height = v.holder_height * 0.04;
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        v.button_width = v.holder_width * 0.25;
        v.button_height = v.holder_height * 0.06;
    };

    SYS_UI.create([
        {
            type:"div", 
            id:"home_start_main_div", 
            attach:div_holder,
            style:{
                width: v.holder_width.toString() + "px",
                height: v.holder_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                background:"transparent",
                backgroundImage:`url( ${ DATA_Image.getImage({name:"game_background",w:v.holder_width,h:v.holder_height}) } )`,
                backgroundSize:  v.holder_width.toString() + "px" + " " +  v.holder_height.toString() + "px"
            }
        },
        {
            type:"button", 
            id:"home_start_button_01", 
            attach:"home_start_main_div",
            style:{
                margin:"2%",
                padding:"1%",
                width: v.button_width.toString() + "px",
                height: v.button_height.toString() + "px",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_Image.getImage({name:"button_arena",w:v.button_width,h:v.button_height}) } )`,
                backgroundSize:  v.button_width.toString() + "px" + " " +  v.button_height.toString() + "px"
            },
            attrib:
            { 
                onclick:"HOME_Start.controls('arena');"
            }
        },
    ]);

};

return f;}());var PHASE_0 = (function(){var f ={};

f.run = function(battledata)
{
    if(battledata.private.phases.initialized === false)
    {
        battledata.private.phases.initialized = true;
        battledata = initialize(battledata);
    };

    if(battledata.private.phases.initialized === true)
    {
        battledata = update(battledata);
    };

    return battledata;
};

function initialize(battledata)
{   
    battledata.core.round_count++;
    battledata.core.round_timer = 3;

    //Regenerate players energies
    battledata = ENGINE_PlayerActions.regenerateEnergy(battledata);

    return battledata;
};

function update(battledata)
{
    //Update round timer every 100 server ticks or 1 second
    if(battledata.private.core.time % 100 === 0)
    {   
        battledata.core.round_timer--;

        if(battledata.core.round_timer <= 0)
        {
            battledata = initializePlayerData("player1",battledata);
            battledata = initializePlayerData("player2",battledata);
            battledata = end(battledata);
        };
    };
    
    return battledata;
};

function end(battledata)
{

    battledata.private.phases.initialized = false;
    battledata.private.phases.stage = 1;

    return battledata;
};

//====================================================================================================================//

function initializePlayerData(player,battledata)
{
    //Now update the player spells from the private data
    battledata[player].selected_spell = battledata.private[player].current_spell_selected;
    
    return battledata;
};


return f;}());var PHASE_1 = (function(){var f ={};

f.run = function(battledata)
{
    if(battledata.private.phases.initialized === false)
    {
        battledata.private.phases.initialized = true;
        battledata = initialize(battledata);
    };

    if(battledata.private.phases.initialized === true)
    {
        battledata = update(battledata);
    };

    return battledata;
};

function initialize(battledata)
{   
    //LET ALL PLAYERS CAST THEIR TYPE B STATUS
    battledata = ENGINE_PlayerActions.castStatus("B",battledata);

    return battledata;
};

function update(battledata)
{
    //Update all the entities
    battledata = ENGINE_Entity.genericUpdate(battledata);

    //After every spell update check player healths
    battledata = ENGINE_Combat.detectBattleStatus(battledata);

    //Check if the character only remains then end the phase
    if(ENGINE_Entity.getNonCharacterCount(battledata) <= 0)
    {
        battledata = end(battledata);
    };

    return battledata;
};

function end(battledata)
{
    battledata.private.phases.initialized = false;
    battledata.private.phases.stage = 2;

    return battledata;
};


return f;}());var PHASE_2 = (function(){var f ={};

f.run = function(battledata)
{
    if(battledata.private.phases.initialized === false)
    {
        battledata.private.phases.initialized = true;
        battledata = initialize(battledata);
    };

    if(battledata.private.phases.initialized === true)
    {
        battledata = update(battledata);
    };

    return battledata;
};

function initialize(battledata)
{  
    //RESET ALL CHARACTER RUN ONCE ANIMATIONS
    var params = {battledata:battledata, mode:"reset_run_once_animation"};
    battledata = ENGINE_Entity.updateCharacter(params);

    //LET ALL PLAYERS CAST THEIR SPELLS
    battledata = ENGINE_PlayerActions.castSpell(battledata);

    return battledata;
};

function update(battledata)
{   
    //Play attack animation when successfully casted an spell
    if(battledata.private.player1.succesful_cast === true)
    {
        var params = { battledata:battledata, mode:"attack", player:"player1" };
        battledata = ENGINE_Entity.updateCharacter(params);
    };
    if(battledata.private.player2.succesful_cast === true)
    {
        var params = { battledata:battledata, mode:"attack", player:"player2" };
        battledata = ENGINE_Entity.updateCharacter(params);
    };

    //Update all the entities
    battledata = ENGINE_Entity.genericUpdate(battledata);

    //After every spell update check player healths
    battledata = ENGINE_Combat.detectBattleStatus(battledata);
    

    //Check if the character only remains then end the phase
    if(ENGINE_Entity.getNonCharacterCount(battledata) <= 0)
    {
        battledata = end(battledata);
    };
    
    return battledata;
};

function end(battledata)
{

    battledata.private.phases.initialized = false;
    battledata.private.phases.stage = 3;

    return battledata;
};


return f;}());var PHASE_3 = (function(){var f ={};

f.run = function(battledata)
{
    if(battledata.private.phases.initialized === false)
    {
        battledata.private.phases.initialized = true;
        battledata = initialize(battledata);
    };

    if(battledata.private.phases.initialized === true)
    {
        battledata = update(battledata);
    };

    return battledata;
};

function initialize(battledata)
{   
    //LET ALL PLAYERS CAST THEIR TYPE C STATUS
    battledata = ENGINE_PlayerActions.castStatus("C",battledata);

    return battledata;
};

function update(battledata)
{
    //Update all the entities
    battledata = ENGINE_Entity.genericUpdate(battledata);

    //After every spell update check player healths
    battledata = ENGINE_Combat.detectBattleStatus(battledata);

    //Check if the character only remains then end the phase
    if(ENGINE_Entity.getNonCharacterCount(battledata) <= 0)
    {
        battledata = end(battledata);
    };

    return battledata;
};

function end(battledata)
{
    battledata.private.phases.initialized = false;
    battledata.private.phases.stage = 0;

    return battledata;
};


return f;}());var SERVER_GATE = (function(){var f ={};

f.initialize = function()
{
    ENGINE_Matchmaking.initialize();
    ENGINE_Core_Run.initialize();
};

f.connect = function(connect_data)
{
    connect_data = JSON.parse(connect_data);

    switch(connect_data.title)
    {
        //Detect battle status
        case "check":
            var player_id = connect_data.body.player_id;
            var the_result = ENGINE_Core_Gate.check(player_id);
            
            //string means no battledata for the player
            if(typeof(the_result) === "string")
            {
                return JSON.stringify({
                    title:"check_result",
                    body:
                    {
                        result:0,
                    }
                });
            }   
            else if(typeof(the_result) === "object")
            {
                return JSON.stringify({
                    title:"check_result",
                    body:
                    {
                        result:1,
                        battledata:the_result
                    }
                });
            };
            
        break;
        //Join battle
        case "join":
            var user_data = connect_data.body.user_data;
            ENGINE_Matchmaking.join(user_data);
        break;
        //Update battle
        case "update":
            var player_id = connect_data.body.player_id;
            var controls_data = connect_data.body.controls_data;
            
            ENGINE_Core_Gate.update(player_id,controls_data);
        break;

    };
};

f.player_disconnected = function(player_id)
{
    //If the client disconnected and battle
    //is not yet started then remove him/her
    //from the match que
    ENGINE_Matchmaking.cancel(player_id);
};

f.offline = function(connect_data)
{
    connect_data = JSON.parse(connect_data);

    switch(connect_data.title)
    {
        case "pause":
            ENGINE_Core_Gate.pause(connect_data.body.player_id);
        break;

        case "unpause":
            ENGINE_Core_Gate.unpause(connect_data.body.player_id);
        break;
    };
};

return f;}());var SFX_ExplodeFire = (function(){var f ={};

const animation_database =
{
    idle: { max_frame:8 , max_speed:5, run_once:true },
};

f.create = function(player_owner,sfx_data)
{
    var new_sfx = 
    {
        info:
        {
            id:ENGINE_Utils.idGenerator(20),
            name: "sfx_explode_fire",
            class: "sfx",
            owner:player_owner
        },
        model:
        {
            sprite: "sfx_explode_fire",
            size: sfx_data.size,
            animation:
            {
                tag: "both",
                name: "idle",
                frame_count:0,
                speed_count:0,
                run_once_animations:[]
            }
        },
        physics:
        {
            old_position:{},//Dont remove this stat
            position:sfx_data.position,
            move_speed: 0,
            move_angle: -1, //-1 means movement disabled
            collision_size: {w:0, h:0},
            has_border_limit: false,
        }
    };

    return new_sfx;
};

f.genericUpdate = function(entity,battledata)
{   
    var entity = ENGINE_Animation.animate("idle",animation_database,entity);

    if(entity.model.animation.run_once_animations.indexOf("idle") >= 0)
    {
        battledata = ENGINE_Entity.deleteEntity(entity,battledata);
    };

    return battledata;
};


return f;}());var SFX_Recharge = (function(){var f ={};

const animation_database =
{
    idle: { max_frame:4 , max_speed:10, run_once:true },
};

f.create = function(player_owner,sfx_data)
{
    var new_sfx = 
    {
        info:
        {
            id:ENGINE_Utils.idGenerator(20),
            name: "sfx_recharge",
            class: "sfx",
            owner:player_owner
        },
        model:
        {
            sprite: "sfx_recharge",
            size: sfx_data.size,
            animation:
            {
                tag: "both",
                name: "idle",
                frame_count:0,
                speed_count:0,
                run_once_animations:[]
            }
        },
        physics:
        {
            old_position:{},//Dont remove this stat
            position:sfx_data.position,
            move_speed: 0,
            move_angle: -1, //-1 means movement disabled
            collision_size: {w:0, h:0},
            has_border_limit: false,
        }
    };

    return new_sfx;
};

f.genericUpdate = function(entity,battledata)
{   
    var entity = ENGINE_Animation.animate("idle",animation_database,entity);

    if(entity.model.animation.run_once_animations.indexOf("idle") >= 0)
    {
        battledata = ENGINE_Entity.deleteEntity(entity,battledata);
    };

    return battledata;
};


return f;}());var SFX_Replenish = (function(){var f ={};

const animation_database =
{
    idle: { max_frame:4 , max_speed:10, run_once:true },
};

f.create = function(player_owner,sfx_data)
{
    var new_sfx = 
    {
        info:
        {
            id:ENGINE_Utils.idGenerator(20),
            name: "sfx_replenish",
            class: "sfx",
            owner:player_owner
        },
        model:
        {
            sprite: "sfx_replenish",
            size: sfx_data.size,
            animation:
            {
                tag: "both",
                name: "idle",
                frame_count:0,
                speed_count:0,
                run_once_animations:[]
            }
        },
        physics:
        {
            old_position:{},//Dont remove this stat
            position:sfx_data.position,
            move_speed: 0,
            move_angle: -1, //-1 means movement disabled
            collision_size: {w:0, h:0},
            has_border_limit: false,
        }
    };

    return new_sfx;
};

f.genericUpdate = function(entity,battledata)
{   
    var entity = ENGINE_Animation.animate("idle",animation_database,entity);

    if(entity.model.animation.run_once_animations.indexOf("idle") >= 0)
    {
        battledata = ENGINE_Entity.deleteEntity(entity,battledata);
    };

    return battledata;
};


return f;}());var SFX_Root = (function(){var f ={};

const animation_database =
{
    idle: { max_frame:3 , max_speed:10, run_once:true },
};

f.create = function(player_owner,sfx_data)
{
    var new_sfx = 
    {
        info:
        {
            id:ENGINE_Utils.idGenerator(20),
            name: "sfx_root",
            class: "sfx",
            owner:player_owner
        },
        model:
        {
            sprite: "sfx_root",
            size: sfx_data.size,
            animation:
            {
                tag: "both",
                name: "idle",
                frame_count:0,
                speed_count:0,
                run_once_animations:[]
            }
        },
        physics:
        {
            old_position:{},//Dont remove this stat
            position:sfx_data.position,
            move_speed: 0,
            move_angle: -1, //-1 means movement disabled
            collision_size: {w:0, h:0},
            has_border_limit: false,
        }
    };

    return new_sfx;
};

f.genericUpdate = function(entity,battledata)
{   
    var entity = ENGINE_Animation.animate("idle",animation_database,entity);

    if(entity.model.animation.run_once_animations.indexOf("idle") >= 0)
    {
        battledata = ENGINE_Entity.deleteEntity(entity,battledata);
    };

    return battledata;
};


return f;}());var SPELL_00 = (function(){var f ={};

f.getSpellStats = function()
{
    var stat = 
    {
        id:"sp00",
        energy_cost:0,
        cast_speed_percentage:0, //1 to 100
    };

    return stat;
};

f.getSpeed = function(player,battledata)
{
    var speed = ENGINE_Utils.rng(1,100);

    return speed;
};

f.start = function(player_owner,battledata)
{
    return battledata;
};

f.genericUpdate = function(entity,battledata)
{   
    return battledata;
};

return f;}());var SPELL_01 = (function(){var f ={};

f.getSpellStats = function()
{
    var stat = 
    {
        id:"sp01",
        energy_cost:10,
        cast_speed_percentage:50, //1 to 100
    };

    return stat;
};

f.getSpeed = function(player,battledata)
{
    var speed = ENGINE_Utils.rng(1,100);

    return speed;
};

f.start = function(player_owner,battledata)
{
    var caster_entity = ENGINE_Entity.getCharacter(player_owner,battledata);
    
    if(player_owner === "player1")
    {
        spell_entity(ENGINE_Physics.getAngleBetweenPoints(caster_entity.physics.position,{x:85, y:caster_entity.physics.position.y} ));
    }
    else if(player_owner === "player2")
    {
        spell_entity(ENGINE_Physics.getAngleBetweenPoints(caster_entity.physics.position,{x:15, y:caster_entity.physics.position.y} ));
    };

    function spell_entity(initial_move_angle)
    {  
        var new_entity = {
            info:
            {
                id:ENGINE_Utils.idGenerator(20),
                name: "sp01",
                class: "spell",
                subclass:"projectile",
                owner:player_owner
            },
            combat:
            {
                damage:100
            },
            model:
            {
                sprite: "sfx_energy_ball",
                size: { w:10, h:10 },
                animation:
                {
                    tag: "both",
                    name: "idle",
                    frame_count:0,
                    speed_count:0,
                }
            },
            physics:
            {
                old_position:{},//Dont remove this stat
                position:caster_entity.physics.position,
                move_speed: 50,
                move_angle: initial_move_angle, //-1 means movement disabled
                collision_size: {w:10, h:10},
                border_limit: { x:{min:0, max:100}, y:{min:0, max:100} },
                has_border_limit: true,
                has_reached_border_limit:false,
            }
        }

        battledata.core.entities.push(ENGINE_Utils.copyObject(new_entity));
    };

    return battledata;
};

f.genericUpdate = function(entity,battledata)
{   
    entity = ENGINE_Physics.updatePosition(entity,battledata.private.core.delta_time);

    var colliders = ENGINE_Physics.getColliders(entity,battledata,["character","shield"]);

    if(colliders.length >= 1)
    {
        //We need to use for loop to break the looping
        //once we encountered our first subclass
        for(var i = 0; i <= colliders.length - 1;i++)
        {
            if(colliders[i].info.subclass === "shield")
            {
                battledata = ENGINE_Entity.deleteEntity(entity,battledata);
                break;
            }
            else if(colliders[i].info.subclass === "character")
            {
                var new_sfx = SFX.create(entity.info.owner,"sfx_explode_fire",{size:{w:10,h:10}, position:colliders[i].physics.position});
                battledata.core.entities.push(new_sfx);
                battledata = ENGINE_Combat.playerCombat(battledata,entity.info.owner,colliders[i].info.owner,entity);
                battledata = STATUS.addStatus("status_root",ENGINE_Utils.getEnemyPlayer(entity.info.owner),battledata);
                battledata = STATUS.addStatus("status_recharge",entity.info.owner,battledata);
                battledata = STATUS.addStatus("status_replenish",entity.info.owner,battledata);
                battledata = ENGINE_Entity.deleteEntity(entity,battledata);
                break;
            };
        };

    }
    else
    {
        if(entity.physics.has_reached_border_limit === true)
        {
            battledata = ENGINE_Entity.deleteEntity(entity,battledata);
        };
    }
    
    return battledata;
};

return f;}());var SPELL_02 = (function(){var f ={};

f.getSpellStats = function()
{
    var stat = 
    {
        id:"sp02",
        energy_cost:100,
        cast_speed_percentage:50, //1 to 100
    };

    return stat;
};

f.getSpeed = function(player,battledata)
{
    var speed = ENGINE_Utils.rng(1,100);

    return speed;
};

f.start = function(player_owner,battledata)
{
    var caster_entity = ENGINE_Entity.getCharacter(player_owner,battledata);
    var init_position = {x:caster_entity.physics.position.x, y:caster_entity.physics.position.y-5}

    var new_entity = {
        info:
        {
            id:ENGINE_Utils.idGenerator(20),
            name: "sp02",
            class: "spell",
            subclass:"shield", //used for collision targeting
            owner:player_owner
        },
        combat:
        {
            duration:5 //seconds
        },
        model:
        {
            sprite: "sfx_shield_blue",
            size: { w:25, h:25 },
            animation:
            {
                tag: "both",
                name: "idle",
                frame_count:0,
                speed_count:0,
            }
        },
        physics:
        {
            old_position:{},//Dont remove this stat
            position:init_position,
            move_speed: 0,
            move_angle: -1, //-1 means movement disabled
            collision_size: {w:25, h:25},
            border_limit: { x:{min:0, max:100}, y:{min:0, max:100} },
            has_border_limit: true,
            has_reached_border_limit:false,
        }
    }

    battledata.core.entities.push(ENGINE_Utils.copyObject(new_entity));

    return battledata;
};

f.genericUpdate = function(entity,battledata)
{   
    var caster_entity = ENGINE_Entity.getCharacter(entity.info.owner,battledata);
    entity.physics.position = {x:caster_entity.physics.position.x, y:caster_entity.physics.position.y-3};

    if(battledata.private.core.time % 100 === 0)
    {   
        entity.combat.duration--;

        if(entity.combat.duration <= 0)
        {
            battledata = ENGINE_Entity.deleteEntity(entity,battledata);
        };
    };

    return battledata;
};

return f;}());var SPELL_03 = (function(){var f ={};

const animation_database =
{
    idle: { max_frame:6 , max_speed:5, run_once:true },
};

f.getSpellStats = function()
{
    var stat = 
    {
        id:"sp03",
        energy_cost:50,
        cast_speed_percentage:50, //1 to 100
    };

    return stat;
};

f.getSpeed = function(player,battledata)
{
    var speed = ENGINE_Utils.rng(1,100);

    return speed;
};

f.start = function(player_owner,battledata)
{
    var caster_entity = ENGINE_Entity.getCharacter(player_owner,battledata);

    if(player_owner === "player1")
    {
        spell_entity("left");
    }
    else if(player_owner === "player2")
    {
        spell_entity("right");
    };

    function spell_entity(model_tag)
    {  
        var new_entity = {
            info:
            {
                id:ENGINE_Utils.idGenerator(20),
                name: "sp03",
                class: "spell",
                subclass:"beam",
                owner:player_owner
            },
            combat:
            {
                duration:0,
                damage:100,
                already_hit_targets:[]
            },
            model:
            {
                sprite: "sfx_fire_beam",
                size: { w:2, h:10 },
                animation:
                {
                    tag: model_tag,
                    name: "idle",
                    frame_count:0,
                    speed_count:0,
                    run_once_animations:[]
                }
            },
            physics:
            {
                old_position:{},//Dont remove this stat
                position:caster_entity.physics.position,
                move_speed: 0,
                move_angle: -1, //-1 means movement disabled
                collision_size: { w:2, h:10 },
                border_limit: { x:{min:0, max:100}, y:{min:0, max:100} },
                has_border_limit: true,
                has_reached_border_limit:false,
            }
        }

        battledata.core.entities.push(ENGINE_Utils.copyObject(new_entity));
    };

    return battledata;
};

f.genericUpdate = function(entity,battledata)
{   
    var caster_entity = ENGINE_Entity.getCharacter(entity.info.owner,battledata);

    entity = ENGINE_Animation.animate("idle",animation_database,entity);
    entity.combat.duration++;
    entity.model.size.w = 15 + (12 * entity.model.animation.frame_count);
    entity.physics.collision_size.w = 15 + (12 * entity.model.animation.frame_count);
    
    if(entity.info.owner === "player1")
    {
        entity.physics.position.x = caster_entity.physics.position.x + (entity.model.size.w / 2);
    }
    else if(entity.info.owner === "player2")
    {
        entity.physics.position.x = caster_entity.physics.position.x - (entity.model.size.w / 2);
    }

    var colliders = ENGINE_Physics.getColliders(entity,battledata,["character"]);

    if(colliders.length >= 1)
    {
        for(var i = 0; i <= colliders.length - 1;i++)
        {  
            if(entity.combat.already_hit_targets.indexOf(colliders[i].info.id) < 0)
            {
                if(colliders[i].info.subclass === "character")
                {
                    entity.combat.already_hit_targets.push(colliders[i].info.id);
                    battledata = ENGINE_Combat.playerCombat(battledata,entity.info.owner,colliders[i].info.owner,entity);
                };
            };
        };
    };
    
    if( entity.combat.duration >= 80)
    {
        battledata = ENGINE_Entity.deleteEntity(entity,battledata);
    };

    return battledata;
};

return f;}());var SPELL_04 = (function(){var f ={};

f.getSpellStats = function()
{
    var stat = 
    {
        id:"sp04",
        energy_cost:50,
        cast_speed_percentage:50, //1 to 100
    };

    return stat;
};

f.getSpeed = function(player,battledata)
{
    var speed = ENGINE_Utils.rng(1,100);

    return speed;
};

f.start = function(player_owner,battledata)
{
    var projectile_amount = 8;
    var random_positions = [];
    
    
    while(random_positions.length <= projectile_amount)
    {
        var y_pos = ENGINE_Utils.rng(50,battledata.private.environment.ground_height);

        if(random_positions.indexOf(y_pos) < 0)
        {
            random_positions.push(y_pos);
        };
    };

    var new_entity = 
    {
        info:
        {
            id:ENGINE_Utils.idGenerator(20),
            name: "sp04",
            class: "spell",
            subclass:"projectile",
            owner:player_owner
        },
        combat:
        {
            duration:0,
            projectile_amount:projectile_amount,
            projectile_positions:random_positions
        }
    }

    battledata.core.entities.push(ENGINE_Utils.copyObject(new_entity));
   
    return battledata;
};

f.genericUpdate = function(entity,battledata)
{   
    if(battledata.private.core.time % 20 === 0)
    {
        entity.combat.duration++;

        if(entity.combat.duration <= entity.combat.projectile_amount)
        {
            var owner = entity.info.owner;
            var tag = {player1:"left",player2:"right"};
            var angle = {player1:180, player2:0};
            var pos_x = {player1:15,player2:85};
            var pos_y = entity.combat.projectile_positions[entity.combat.duration];

            battledata = createFireProjectile(owner,tag[owner],angle[owner],{x:pos_x[owner], y:pos_y}, battledata);    
        };
    };

    var projectile_remaining = 0;

    for(var i = 0; i <= battledata.core.entities.length - 1; i++)
    {  
        if(Object.keys(battledata.core.entities[i]).length >= 1)
        {
            if(battledata.core.entities[i].info.owner === entity.info.owner)
            {
                if(battledata.core.entities[i].info.name === "ab04_projectile")
                {
                    projectile_remaining++;
                    battledata = updateFireProjectile(battledata.core.entities[i],battledata);
                };
            };
        };
    };    

    if(projectile_remaining <= 0 && entity.combat.duration > entity.combat.projectile_amount)
    {
        battledata = ENGINE_Entity.deleteEntity(entity,battledata);
    };

    return battledata;
};


function createFireProjectile(owner,animation_tag,angle,position,battledata)
{
    var new_entity = {
        info:
        {
            id:ENGINE_Utils.idGenerator(20),
            name: "ab04_projectile",
            class: "spell",
            subclass:"projectile",
            owner:owner
        },
        combat:
        {
            damage:100
        },
        model:
        {
            sprite: "sfx_rain_of_fire",
            size: { w:12, h:6 },
            animation:
            {
                tag: animation_tag,
                name: "idle",
                frame_count:0,
                speed_count:0,
            }
        },
        physics:
        {
            old_position:{},//Dont remove this stat
            position:position,
            move_speed: 150,
            move_angle: angle, //-1 means movement disabled
            collision_size: {w:12, h:6},
            border_limit: { x:{min:0, max:100}, y:{min:0, max:100} },
            has_border_limit: true,
            has_reached_border_limit:false,
        }
    }

    battledata.core.entities.push(ENGINE_Utils.copyObject(new_entity));

    return battledata;
};

function updateFireProjectile(entity,battledata)
{
    entity = ENGINE_Physics.updatePosition(entity,battledata.private.core.delta_time);

    var colliders = ENGINE_Physics.getColliders(entity,battledata,["character","shield"]);

    if(colliders.length >= 1)
    {
        //We need to use for loop to break the looping
        //once we encountered our first subclass
        for(var i = 0; i <= colliders.length - 1;i++)
        {
            if(colliders[i].info.subclass === "shield")
            {
                battledata = ENGINE_Entity.deleteEntity(entity,battledata);
                break;
            }
            else if(colliders[i].info.subclass === "character")
            {
                var new_sfx = SFX.create(entity.info.owner,"sfx_explode_fire",{size:{w:10,h:10}, position:colliders[i].physics.position});
                battledata.core.entities.push(new_sfx);
                battledata = ENGINE_Combat.playerCombat(battledata,entity.info.owner,colliders[i].info.owner,entity);
                battledata = STATUS.addStatus("status_sample1",entity.info.owner,battledata);
                battledata = STATUS.addStatus("status_sample2",entity.info.owner,battledata);
                battledata = STATUS.addStatus("status_sample3",entity.info.owner,battledata);
                battledata = STATUS.addStatus("status_sample4",entity.info.owner,battledata);
                battledata = STATUS.addStatus("status_sample5",entity.info.owner,battledata);
                battledata = STATUS.addStatus("status_sample6",entity.info.owner,battledata);
                battledata = ENGINE_Entity.deleteEntity(entity,battledata);
                break;
            };
        };

    }
    else
    {
        if(entity.physics.has_reached_border_limit === true)
        {
            battledata = ENGINE_Entity.deleteEntity(entity,battledata);
        };
    }
    
    return battledata;
};

return f;}());var STATUS_Recharge = (function(){var f ={};

f.add = function(player_target,battledata,params)
{
    var player = battledata[player_target];

    var status_data = 
    {
        name:"status_recharge",
        code:"RCH",
        type:"C", //A or B or C
        speed_condition:"fastest",
        color:"linear-gradient(#0e6b0e, #FBE106)",
        stacks: 1
    };

    if(player.status.length >= 1)
    {
        var result = STATUS.checkStatus("do_exist",player.status,{target_status:"status_recharge"});

        if(result.length >= 1)
        {
            result.forEach(function(index){
                player.status[index].stacks++;
            });
        }
        else
        {
            player.status = STATUS.insertNewStatus(player.status,status_data,battledata);
        };
    }
    else
    {
        player.status = STATUS.insertNewStatus(player.status,status_data,battledata);
    };
    
    return battledata;
};

f.activate = function(player_owner,battledata)
{
    //When we activate we reduce the stack by 1;
    var player = battledata[player_owner];
    if(player.status.length >= 1)
    {
        var result = STATUS.checkStatus("do_exist",player.status,{target_status:"status_recharge"});
        if(result.length >= 1)
        {
            result.forEach(function(index)
            {
                player.status[index].stacks--;
            });
        };
    };

    //When we activate we create an sfx for recharge on the owner's
    //character current position
    var target_entity = ENGINE_Entity.getCharacter(player_owner,battledata);
    var new_sfx = SFX.create(player_owner,"sfx_recharge",{size:{w:30,h:30}, position:target_entity.physics.position});
    battledata.core.entities.push(new_sfx);
    
    return battledata;
};





return f;}());var STATUS_Replenish = (function(){var f ={};

f.add = function(player_target,battledata,params)
{
    var player = battledata[player_target];

    var status_data = 
    {
        name:"status_replenish",
        code:"RPL",
        type:"B", //A or B or C
        speed_condition:"fastest",
        color:"linear-gradient(#0e6b0e, #FBE106)",
        stacks: 1
    };

    if(player.status.length >= 1)
    {
        var result = STATUS.checkStatus("do_exist",player.status,{target_status:"status_replenish"});

        if(result.length >= 1)
        {
            result.forEach(function(index){
                player.status[index].stacks++;
            });
        }
        else
        {
            player.status = STATUS.insertNewStatus(player.status,status_data,battledata);
        };
    }
    else
    {
        player.status = STATUS.insertNewStatus(player.status,status_data,battledata);
    };
    
    return battledata;
};

f.activate = function(player_owner,battledata)
{
    //When we activate we reduce the stack by 1;
    var player = battledata[player_owner];
    if(player.status.length >= 1)
    {
        var result = STATUS.checkStatus("do_exist",player.status,{target_status:"status_replenish"});
        if(result.length >= 1)
        {
            result.forEach(function(index)
            {
                player.status[index].stacks--;
            });
        };
    };

    //When we activate we create an sfx for recharge on the owner's
    //character current position
    var target_entity = ENGINE_Entity.getCharacter(player_owner,battledata);
    var new_sfx = SFX.create(player_owner,"sfx_replenish",{size:{w:30,h:30}, position:target_entity.physics.position});
    battledata.core.entities.push(new_sfx);
    
    return battledata;
};





return f;}());var STATUS_Root = (function(){var f ={};

f.add = function(player_target,battledata,params)
{
    var player = battledata[player_target];

    var status_data = 
    {
        name:"status_root",
        code:"ROT",
        type:"A", //A or B or C
        speed_condition:"slowest", //fastest or slowest
        color:"linear-gradient(#0e6b0e, #FBE106)",
        stacks: 1
    };

    if(player.status.length >= 1)
    {
        var result = STATUS.checkStatus("do_exist",player.status,{target_status:"status_root"});

        if(result.length >= 1)
        {
            result.forEach(function(index){
                player.status[index].stacks++;
            });
        }
        else
        {
            player.status = STATUS.insertNewStatus(player.status,status_data,battledata);
        };
    }
    else
    {
        player.status = STATUS.insertNewStatus(player.status,status_data,battledata);
    };
    
    return battledata;
};

f.activate = function(player_owner,battledata)
{
    //When we activate we reduce the stack by 1;
    var player = battledata[player_owner];
    
    if(player.status.length >= 1)
    {
        var result = STATUS.checkStatus("do_exist",player.status,{target_status:"status_root"});
        if(result.length >= 1)
        {
            result.forEach(function(index)
            {
                player.status[index].stacks--;
            });
        };
    };

    //When we activate we create an sfx for recharge on the owner's
    //character current position
    var target_entity = ENGINE_Entity.getCharacter(player_owner,battledata);

    var size = {w:25,h:15};
    var position = {x:0, y:0};
    position.x = target_entity.physics.position.x;
    position.y = target_entity.physics.position.y + (size.h * 0.05);

    var new_sfx = SFX.create(player_owner,"sfx_root",{size:size, position:position});
    battledata.core.entities.push(new_sfx);
    
    return battledata;
};





return f;}());var STATUS_Sample1 = (function(){var f ={};

f.add = function(player_target,battledata,params)
{
    var player = battledata[player_target];

    var status_data = 
    {
        name:"status_sample1",
        code:"S1",
        type:"A", //A or B or C
        speed_condition:"slowest", //fastest or slowest
        color:"linear-gradient(#0e6b0e, #FBE106)",
        stacks: 1
    };

    if(player.status.length >= 1)
    {
        var result = STATUS.checkStatus("do_exist",player.status,{target_status:"status_sample1"});

        if(result.length >= 1)
        {
            result.forEach(function(index){
                player.status[index].stacks++;
            });
        }
        else
        {
            player.status = STATUS.insertNewStatus(player.status,status_data,battledata);
        };
    }
    else
    {
        player.status = STATUS.insertNewStatus(player.status,status_data,battledata);
    };
    
    return battledata;
};

f.activate = function(player_owner,battledata)
{
    return battledata;
};





return f;}());var STATUS_Sample2 = (function(){var f ={};

f.add = function(player_target,battledata,params)
{
    var player = battledata[player_target];

    var status_data = 
    {
        name:"status_sample2",
        code:"S2",
        type:"A", //A or B or C
        speed_condition:"slowest", //fastest or slowest
        color:"linear-gradient(#0e6b0e, #FBE106)",
        stacks: 1
    };

    if(player.status.length >= 1)
    {
        var result = STATUS.checkStatus("do_exist",player.status,{target_status:"status_sample2"});

        if(result.length >= 1)
        {
            result.forEach(function(index){
                player.status[index].stacks++;
            });
        }
        else
        {
            player.status = STATUS.insertNewStatus(player.status,status_data,battledata);
        };
    }
    else
    {
        player.status = STATUS.insertNewStatus(player.status,status_data,battledata);
    };
    
    return battledata;
};

f.activate = function(player_owner,battledata)
{
    return battledata;
};





return f;}());var STATUS_Sample3 = (function(){var f ={};

f.add = function(player_target,battledata,params)
{
    var player = battledata[player_target];

    var status_data = 
    {
        name:"status_sample3",
        code:"S3",
        type:"A", //A or B or C
        speed_condition:"slowest", //fastest or slowest
        color:"linear-gradient(#0e6b0e, #FBE106)",
        stacks: 1
    };

    if(player.status.length >= 1)
    {
        var result = STATUS.checkStatus("do_exist",player.status,{target_status:"status_sample3"});

        if(result.length >= 1)
        {
            result.forEach(function(index){
                player.status[index].stacks++;
            });
        }
        else
        {
            player.status = STATUS.insertNewStatus(player.status,status_data,battledata);
        };
    }
    else
    {
        player.status = STATUS.insertNewStatus(player.status,status_data,battledata);
    };
    
    return battledata;
};

f.activate = function(player_owner,battledata)
{
    return battledata;
};





return f;}());var STATUS_Sample4 = (function(){var f ={};

f.add = function(player_target,battledata,params)
{
    var player = battledata[player_target];

    var status_data = 
    {
        name:"status_sample4",
        code:"S4",
        type:"A", //A or B or C
        speed_condition:"slowest", //fastest or slowest
        color:"linear-gradient(#0e6b0e, #FBE106)",
        stacks: 1
    };

    if(player.status.length >= 1)
    {
        var result = STATUS.checkStatus("do_exist",player.status,{target_status:"status_sample4"});

        if(result.length >= 1)
        {
            result.forEach(function(index){
                player.status[index].stacks++;
            });
        }
        else
        {
            player.status = STATUS.insertNewStatus(player.status,status_data,battledata);
        };
    }
    else
    {
        player.status = STATUS.insertNewStatus(player.status,status_data,battledata);
    };
    
    return battledata;
};

f.activate = function(player_owner,battledata)
{
    return battledata;
};





return f;}());var STATUS_Sample5 = (function(){var f ={};

f.add = function(player_target,battledata,params)
{
    var player = battledata[player_target];

    var status_data = 
    {
        name:"status_sample5",
        code:"S5",
        type:"A", //A or B or C
        speed_condition:"slowest", //fastest or slowest
        color:"linear-gradient(#0e6b0e, #FBE106)",
        stacks: 1
    };

    if(player.status.length >= 1)
    {
        var result = STATUS.checkStatus("do_exist",player.status,{target_status:"status_sample5"});

        if(result.length >= 1)
        {
            result.forEach(function(index){
                player.status[index].stacks++;
            });
        }
        else
        {
            player.status = STATUS.insertNewStatus(player.status,status_data,battledata);
        };
    }
    else
    {
        player.status = STATUS.insertNewStatus(player.status,status_data,battledata);
    };
    
    return battledata;
};

f.activate = function(player_owner,battledata)
{
    return battledata;
};





return f;}());var STATUS_Sample6 = (function(){var f ={};

f.add = function(player_target,battledata,params)
{
    var player = battledata[player_target];

    var status_data = 
    {
        name:"status_sample6",
        code:"S6",
        type:"A", //A or B or C
        speed_condition:"slowest", //fastest or slowest
        color:"linear-gradient(#0e6b0e, #FBE106)",
        stacks: 1
    };

    if(player.status.length >= 1)
    {
        var result = STATUS.checkStatus("do_exist",player.status,{target_status:"status_sample6"});

        if(result.length >= 1)
        {
            result.forEach(function(index){
                player.status[index].stacks++;
            });
        }
        else
        {
            player.status = STATUS.insertNewStatus(player.status,status_data,battledata);
        };
    }
    else
    {
        player.status = STATUS.insertNewStatus(player.status,status_data,battledata);
    };
    
    return battledata;
};

f.activate = function(player_owner,battledata)
{
    return battledata;
};





return f;}());var SYS_Data = (function(){var f ={};

f.game =  
{
     version:0,
     touch_enable:false,
     orientation:"portrait",
     window_width:0,
     window_height:0,
     localstorage_enabled: false,
     localstorage_id:"mduel_data",
     current_interface:"menu",
};

f.online_arena =
{
     debug:false,
     debug_server_url:'ws://localhost:3000/',
     production_server_url:"wss://mduel.herokuapp.com/",
     server:WebSocket,
     server_message:"",
     server_timer:setInterval,
};

f.offline_arena =
{
     server:function(){},
     server_message:"",
     server_timer:setInterval,
};

f.arena_data = 
{
     user_data:{},
     battledata:{},
     controls_data:
     {
          spell_selected:0,
          previous_spell_selected:0
     },
};

return f;}());var SYS_Initializer = (function(){var f ={};

f.start = function()
{
    //Load the game sprite image
    SYS_Sprite.initialize();

    //Load previous data
    SYS_LocalStorage.initialize();

    //Prepapre the interface
    SYS_Interface.initialize();

};

return f;}());var SYS_Interface = (function(){var f ={};

f.initialize = function()
{
    //Initialize SYS_UI main holder
    SYS_UI.body = "body";

    //Set up document CSS
    setupDocumentBody();

    //Save interface data
    saveInterfaceData();

    //Detect interface changes
    //Only use 100 to prevent lag
    setInterval(updateChanges,100);

    //Start game interface
    startCurrentGameInterface();

};

function setupDocumentBody()
{
    document.body.style.width  = window.innerWidth.toString() + "px";
    document.body.style.height  = window.innerHeight.toString() + "px";
    document.body.style.overflow  = "hidden";
    document.body.style.position  = "absolute";
};


function saveInterfaceData()
{
    //Save the current interface window sizes
    SYS_Data.game.window_width = window.innerWidth;
    SYS_Data.game.window_height = window.innerHeight;

    //Detect if touch is enabled 
    if(window.matchMedia("(any-hover: none)").matches)
    {
        SYS_Data.game.touch_enable = true;
    }
    else if(window.matchMedia("(any-hover: hover)").matches)
    {
        SYS_Data.game.touch_enable = false;
    };

    //Detect orientation
    if (window.matchMedia("(orientation: portrait)").matches)
    {
        SYS_Data.game.orientation = "portrait";
    }
    else if(window.matchMedia("(orientation: landscape)").matches)
    {
        SYS_Data.game.orientation = "landscape";
    };
    
};

function updateChanges()
{
    var reload_now = false;

    //Detect screen size change
    //Also it detects any orientation changes
    if(SYS_Data.game.window_width !== window.innerWidth || SYS_Data.game.window_height !== window.innerHeight)
    {
        reload_now = true;
    };

    //Detect if mouse has been connected/disconnected
    if(window.matchMedia("(any-hover: none)").matches && SYS_Data.game.touch_enable === false)
    {
        reload_now = true;
    }
    else if(window.matchMedia("(any-hover: hover)").matches && SYS_Data.game.touch_enable === true)
    {
        reload_now = true;
    };

    if(reload_now === true)
    {
        location.reload();
    };

};

function startCurrentGameInterface()
{

    switch(SYS_Data.game.current_interface)
    {
        case "home_start":
            HOME_Start.initialize();
        break;

        case "home_arena":
            HOME_Arena.initialize();
        break;

        case "arena_online":
            ARENA_ONLINE.initialize();
        break;

        case "arena_offline":
            ARENA_OFFLINE.initialize();
        break;

        default:
            HOME_Start.initialize();
        break;
    };
};

return f;}());var SYS_LocalStorage = (function(){var f ={};

f.initialize = function()
{
    //Load Local Storage Data
    f.load();

    //Periodically save game data
    setInterval(f.save,100);
};

f.load = function()
{
    if(SYS_Data.game.localstorage_enabled === true)
    {
        var data = JSON.parse(window.localStorage.getItem(SYS_Data.game.localstorage_id));

        if(data !== null)
        {
            if(data.game.version !== null || typeof(data.game.version) !== "undefined"){
    
                if(data.game.version !== SYS_Data.game.version){
                    window.localStorage.removeItem(SYS_Data.game.localstorage_id);
                }else{
                    SYS_Data.game = data.game;
                    SYS_Data.online = data.online;
                    SYS_Data.arena_data = data.arena_data;
                };
    
            }else{
                window.localStorage.removeItem(SYS_Data.game.localstorage_id);
            };
        };
    }
    else
    {
        window.localStorage.clear();
    };

};

f.save = function()
{
    if(SYS_Data.game.localstorage_enabled === true)
    {
        window.localStorage.setItem(SYS_Data.game.localstorage_id,JSON.stringify(SYS_Data));
    }
    else
    {
        window.localStorage.clear();
    };

};


return f;}());var SYS_Sprite = (function(){var f ={};

var game_sprite_image;

f.initialize = function()
{
    //Load sprite
    game_sprite_image = new Image();
    game_sprite_image.crossOrigin = "Anonymous";
    game_sprite_image.src = "././media/game_sprite/game_sprite.png";

};

f.get_sprite_data = function(sprite_name)
{
    return {
        image: game_sprite_image,
        data: GAME_SPRITE["frames"][`${sprite_name}.png`]["frame"]
    };
};

return f;}());var SYS_UI = (function(){var f = {};

/*
    .create([{type:"",attach:"",id:""}]);
    .create([{type:"",attach:"",id:"",class:"",text:"",attrib:{onclick:""}}]);

    .attrib([{id:"",onclick:"foo();"}]);
    .attrib([{id:"",onclick:"foo();",onmouseover:"bar();"}]);

    .style([{id:"",color:"red"}]);
    .style([{id:"",fontSize:"12px",backgroundColor:"red"}]);

    var mylist = ["q1","q2","q3"];
    .selection({id:"",attach:"",value:"content"/"index",list:mylist,function:"bar();"});

    .progress_bar({id:"",attach:"",width:"300px",height:"100px",color:"green"});
    .progress_bar({id:"",current:100,max:2000});

    id = the element id of the cooldown mask div
    .cooldown({id:"",current:3,max:10});

*/

f.body = "";

f.clear = function(params)
{
    /*
        This function deletes only child elements
    */

    var a = document.getElementById(params.id); 

    if(a !== null)
    {
        while (a.hasChildNodes())
        {
            a.removeChild(a.firstChild);
        };
    };
};

f.delete = function(params) 
{
    /*
        This function deletes the parent element 
        including the child elements
    */
        
    var a = document.getElementById(params.id); 

    if(a !== null) 
    {
        a.parentNode.removeChild(a);
    };
};


f.create = function(params)
{
    
    for(var i = 0; i <= params.length - 1; i++)
    {
        var new_element = null;

        if(typeof(params[i].type) !== "undefined")
        {
            new_element = document.createElement(params[i].type);
    
            if(typeof(params[i].attach) !== "undefined" && new_element !== null)
            {
                var attach_element = document.getElementById(params[i].attach);
                attach_element.appendChild(new_element);
            };
        };
    
        if(typeof(params[i].id) !== "undefined" && new_element !== null)
        {
            new_element.setAttribute("id",params[i].id);
        };
    
        if(typeof(params[i].class) !== "undefined" && new_element !== null)
        {
            new_element.setAttribute("class",params[i].class);
        };
    
        if(typeof(params[i].text) !== "undefined" && new_element !== null)
        {
            var text_element = document.createTextNode(params[i].text);
            new_element.appendChild(text_element);
        };
            
        if(typeof(params[i].attrib) !== "undefined" && new_element !== null)
        {
            params[i].attrib.id = params[i].id;
            f.attrib([params[i].attrib]);
        };
    
        if(typeof(params[i].style) !== "undefined" && new_element !== null)
        {
            params[i].style.id = params[i].id;
            f.style([params[i].style]);
        };

    };

};

f.attrib = function(params){

    for(var i = 0; i <= params.length - 1; i++)
    {
        try
        {
            var target_element = document.getElementById(params[i].id);
    
            for (var key of Object.keys(params[i]))
            {
                if(key.toString() !== "id"){
                    target_element.setAttribute(key.toString(),params[i][key]);
                }  
            };

        }catch(e)
        {
            console.log(`ERROR: Requires id:{} >>> " + ${JSON.stringify(params)}`);
        };
    };

};

f.style = function(params)
{
    for(var i = 0; i <= params.length - 1; i++)
    {

        try
        {
            var target_element = document.getElementById(params[i].id);

            for (var key in params[i])
            {
                if(key.toString() !== "id"){
                    target_element.style[key] = params[i][key];
                };  
            };

        }catch(e)
        {
            console.log(`ERROR: Requires id:{} >>> " + ${JSON.stringify(params)}`);
        };

    };
};

f.selection = function(params)
{
    if(typeof(params.id) !== "undefined")
    {

        if(typeof(params.attach) !== "undefined")
        {
            var selection_element = document.createElement("SELECT");
            selection_element.setAttribute("id",params.id);

            var attach_element = document.getElementById(params.attach);
            attach_element.appendChild(selection_element);
        };

        if(typeof(params.function) !== "undefined")
        {
            selection_element.setAttribute("onchange",params.function);
        };

        if(typeof(params.list) !== "undefined")
        {
            for (var i = 0;i < params.list.length;i++)
            {
                var option_element = document.createElement("OPTION");
                option_element.setAttribute("id",params.id+"_option"+i);
                option_element.setAttribute("class",params.id+"_class");

                var text_element = document.createElement("P"); 
                text_element.innerHTML = params.list[i];
                text_element.setAttribute("class",params.id+"_texts");

                option_element.appendChild(text_element);

                if(typeof(params.value) !== "undefined" && params.value === "content")
                {
                    option_element.setAttribute("value",params.list[i]);

                }else if(typeof(params.value) !== "undefined" && params.value === "index")
                {
                    option_element.setAttribute("value",i);
                };

                selection_element.appendChild(option_element);
                    
                            
            };//end for
                    
        };//end if

    };

};

f.progressBar = function(params)
{
    if(typeof(params.id) !== "undefined")
    {
        if(typeof(params.attach) !== "undefined")
        {
            var holder_element = document.createElement("DIV");
            holder_element.setAttribute("id",params.id+"_holder");
            holder_element.style.width = params.width; 
            holder_element.style.height = params.height; 
            holder_element.style.border = "solid black 1px";
            holder_element.style.backgroundColor = params.bgcolor;
            holder_element.style.position = "absolute";
            holder_element.style.display = "flex";
            holder_element.style.flexDirection = "column";
            holder_element.style.justifyContent = "center";
            holder_element.style.aligntItems = "center";
            holder_element.style.textAlign = "center";
    
            var attach_element = document.getElementById(params.attach);
            attach_element.appendChild(holder_element);

            var bar_element = document.createElement("DIV");
            bar_element.setAttribute("id",params.id+"_bar");
            bar_element.style.width = "60%"; 
            bar_element.style.height = "100%";
            bar_element.style.backgroundColor = params.color;
            bar_element.style.position = "absolute";
            bar_element.style.zIndex = 1;

            holder_element.appendChild(bar_element);

            if(params.show_text === true)
            {
                var text_element = document.createElement("P");
                text_element.innerHTML = "0";
                text_element.setAttribute("id",params.id+"_bar_txt");
                text_element.style.color = params.text_color;
                text_element.style.textAlign = "center";
                text_element.style.fontWeight = "bold";
                text_element.style.fontSize = params.font_size.toString() + "px";
                text_element.style.zIndex = 2;

                holder_element.appendChild(text_element);
            };

        };

        if(typeof(params.current) !== "undefined" && typeof(params.max) !== "undefined")
        {
            var target_element = document.getElementById(params.id + "_bar");

            var percentage = params.current / params.max;
            percentage = Math.floor(percentage * 100);
                
            if(percentage < 0)
            {
                percentage = 0
            };
                
            target_element.style.width = percentage+"%";

            document.getElementById(params.id + "_bar_txt").innerHTML = `${params.current}`;
        };

    };
};

f.cooldown = function(params)
{
    var el = document.getElementById(params.id);
    var cd_percent = 100 * (params.current / params.max);
    var cd_pos = 100 - cd_percent;

    if(cd_percent > -1)
    {
        el.style.height = cd_percent.toString() + "%";
        el.style.top = cd_pos.toString() + "%";
    };
        
};


return f;}());var SYS_Utils = (function(){var f = {};

f.copyArray = function(target_array)
{
    //THIS FUNCTION DOES NOT MUTATE/AFFECT THE TARGET ARRAY
    //AND CREATE A NEW INSTANCE OF NEW ARRAY
    var new_array = [];
    
    new_array = target_array.map(function(target_data){
       if(typeof(target_data) !== 'object'){
           return target_data;
       }else if(typeof(target_data) === 'object'){
           var new_target_array = [];
           try{ new_target_array = f.copy_array(target_data);  }catch(e){return target_data;};
           return new_target_array;
       };
        
    });
       
    return new_array;
};

f.copyObject = function(target_object)
{
    if(typeof(target_object) === "string")
    {
        //In case the target object used JSON.stringify
        return JSON.parse(target_object);
    }
    else 
    {
        return JSON.parse(JSON.stringify(target_object));
    }
};

f.combineArray = function(target,value){
    var new_array = [];
    target.map(function(target){new_array.push(target); });
    value.map(function(target){new_array.push(target); });
    return new_array;
};

f.removeDataFromArray = function(target,array){
    var newarray = [];
    var i = 0;
    for(;i < array.length;i++){
        if(array[i] !== target){newarray.push(array[i]);};
    };
    return newarray;
};
f.removeDataFromArray_UsingID = function(id,array){
    var newarray = [];
    var i = 0;
    for(;i < array.length;i++){
        if(i !== id){newarray.push(array[i]);};
    };
    return newarray;
};

f.combineText = function(textarray){
    var combinetext = "";
    var i = 0;
    for(; i < textarray.length; i++){
        combinetext = combinetext.concat(textarray[i]);
    };
    return combinetext;
};

f.concatList = function(array,mode,seperator){
    var concat_txt = "";
    var i = 0;
    for(;i < array.length;i++){
        switch(mode){
            case "seperate":
                concat_txt = concat_txt.concat(array[i] + seperator);
            break;
            case "normal":
                concat_txt = concat_txt.concat(array[i]);
            break;
            default:
                concat_txt = concat_txt.concat(array[i]);
            break;
        };
        
    };
    return concat_txt;
};
f.rng = function(min,max){
        var max2 = max + 1;
        var rng_value = Math.floor(Math.random() * Math.floor(max2));
        if(rng_value < min){rng_value = min;};
        return rng_value;
};

f.numberToString = function(value){
    if(value >= 0){
        var txt1 = value.toString();
        var txt2 = "+";
        var txt3 = txt2.concat(txt1);
        return txt3;
    }else if(value < 0){
        var txt4 = value.toString();
        return txt4;
    };
};

f.idGenerator = function(id_length){
        var all_characters = ["0","1","2","3","4","5","6","7","8","9","Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Z","X","C","V","B","N","M"];
        var full_id = "";
        var randnumber = 0;
        while(id_length > 0){
           id_length--;
           randnumber = f.rng(1,all_characters.length);
           full_id = full_id.concat(all_characters[randnumber-1]);
        };
        return full_id;
    };
    
f.generateNumber = function(raw_number){
            
        var thenumber_string = "EMPTY";
        var thenumber = raw_number.toString();
    
        if(raw_number < 10){
            thenumber_string = "000" + thenumber;
        }else if(raw_number >= 10 &&  raw_number <= 99 ){
            thenumber_string = "00" + thenumber;
        }else if(raw_number >= 100 &&  raw_number <= 999 ){
            thenumber_string = "0" + thenumber;
        }else if(raw_number >= 1000 ){
            thenumber_string = thenumber;
        };
            
        return thenumber_string;
           
};

f.generateNumberByTen = function(raw_number){
            
    var thenumber_string = "EMPTY";
    var thenumber = raw_number.toString();

    if(raw_number < 10){
        thenumber_string = "0" + thenumber;
    }else if(raw_number >= 10 ){
        thenumber_string = thenumber;
    };
        
    return thenumber_string;
       
};

f.getDate = function(){
    
    var today = new Date();
    var dd = String(today.getDate()).padStart(2,'0');
    var mm = String(today.getMonth() + 1).padStart(2,'0');
    var yyyy = today.getFullYear();
        
    var file_date = [mm,dd,yyyy];
    
    return file_date;
};
   
return f;}());var ARENA_OFFLINE = (function(){var f ={};

f.initialize = function()
{
    //Save current interface
    SYS_Data.game.current_interface = "arena_offline";

    //Clear the interface first before adding anything
    SYS_UI.clear({id:SYS_UI.body});
    
    //Show the interface
    createInterface(SYS_UI.body);

    //Connect to offline server
    offlineConnection()
};

//=========================================================================

function offlineConnection()
{ 
    var offline = SYS_Data.offline_arena;
    var server_input = {};

    offline.server_interval = setInterval(function()
    {
        //Send the battledata_id to the server to detect
        //the current status of the battle
        server_input = getServerInput("check");
        offline.server_message = SERVER_GATE.connect(JSON.stringify(server_input));
        offline.server_message = JSON.parse(offline.server_message);
        
        //Get the check result
        //0 = player not yet joined
        if(offline.server_message.title === "check_result" && offline.server_message.body.result === 0)
        {   
            //The human player will join the battle
            server_input = getServerInput("join");
            SERVER_GATE.connect(JSON.stringify(server_input));

            //Prepare the AI
            AI_ARENA_Core.createAI();

            //The AI player will join the battle
            server_input = AI_ARENA_Core.getServerInput("join");
            SERVER_GATE.connect(JSON.stringify(server_input));
        }
        else if(offline.server_message.title === "check_result" && offline.server_message.body.result === 1)
        {
            SYS_Data.arena_data.battledata = offline.server_message.body.battledata;

            //Lets detect if the ARENA_Core.initialized() has
            //already been started so tha it can only run once
            try{ document.getElementById("arena_battleground_layout_div").innerHTML; }catch(e)
            {
                ARENA_Core.initializeInterface();
            };

            //Update the ARENA
            try
            { 
                //Use battleover than gameover to ensure the arena result will show
                //but dont remove the gameover in the Server because it is still important
                if(SYS_Data.arena_data.battledata.core.status === "battleover")
                {
                    ARENA_Result.initialize(SYS_Data.arena_data.battledata,SYS_Data.arena_data.user_data);
                    
                    if(SYS_Data.game.current_interface === "arena_result")
                    {
                        //Only stop the server_interval if the arena result showed
                        //up. Because if you change tab or change window the arena
                        //result will not show up if it is interrupted at the 
                        //transition part.
                        clearInterval(SYS_Data.offline.server_interval);
                    };
                }
                else
                { 
                    ARENA_Core.updateInterface();

                    server_input = getServerInput("update");
                    SERVER_GATE.connect(JSON.stringify(server_input));

                    server_input = AI_ARENA_Core.getServerInput("update");
                    SERVER_GATE.connect(JSON.stringify(server_input));
                };
            }catch(error)
            {
                //If there something return in the returned battledata
                //then proceed to RESULT INTERFACE
                console.log(error);
                ARENA_Result.initialize(error.message);

                if(SYS_Data.game.current_interface === "arena_result")
                {
                    //Only stop the server_interval if the arena result showed
                    //up. Because if you change tab or change window the arena
                    //result will not show up if it is interrupted at the 
                    //transition part.
                    clearInterval(SYS_Data.offline.server_interval);
                };
            };
        };
        

    },10);

};

function getServerInput(mode)
{
    switch(mode)
    {
        case "check":
            return {
                title:"check",
                body:
                {
                    player_id:SYS_Data.arena_data.user_data.id
                }
            };
        break;
        case "join":
            return {
                title:"join",
                body:
                {
                    user_data:SYS_Data.arena_data.user_data
                }
            };
        break;
        case "update":
            return {
                title:"update",
                body:
                {
                    player_id: SYS_Data.arena_data.user_data.id,
                    controls_data: SYS_Data.arena_data.controls_data
                }
            };
        break;
    };
};

function createInterface(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(SYS_Data.game.orientation === "portrait")
    {
        v.image_width = v.holder_width * 0.70;
        v.image_height = v.holder_height * 0.10;

        v.margin = "20%";
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        v.image_width = v.holder_width * 0.45;
        v.image_height = v.holder_height * 0.15;

        v.margin = "10%"
    };

    SYS_UI.create([
        {
            type:"div", 
            id:"arena_online_main_div", 
            attach:div_holder,
            style:{
                width: v.holder_width.toString() + "px",
                height: v.holder_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                background:"transparent",
                backgroundImage:`url( ${ DATA_Image.getImage({name:"game_background",w:v.holder_width,h:v.holder_height}) })`,
                backgroundSize:  v.holder_width.toString() + "px" + " " +  v.holder_height.toString() + "px"
            }
        },
        {
            type:"div", 
            id:"arena_online_image", 
            attach:"arena_online_main_div",
            style:{
                width: v.image_width.toString() + "px",
                height: v.image_height.toString() + "px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_Image.getImage({name:"text_connecting",w:v.image_width,h:v.image_height}) })`,
                backgroundSize:  v.image_width.toString() + "px" + " " +  v.image_height.toString() + "px"
            }
        },
    ]);

};

return f;}());var ARENA_ONLINE = (function(){var f ={};

f.initialize = function()
{
    //Save current interface
    SYS_Data.game.current_interface = "arena_online";

    //Clear the interface first before adding anything
    SYS_UI.clear({id:SYS_UI.body});
    
    //Show the interface
    createInterface(SYS_UI.body);

    //Connect to the server
    onlineConnection();

};
//=============================================================================

function onlineConnection()
{   

    var online = SYS_Data.online_arena;
    var server_input = {};

    if(online.debug === true)
    {  online.server =  new WebSocket(`${online.debug_server_url}${SYS_Data.arena_data.user_data.id}`);  }
    else if(online.debug === false)
    {  online.server =  new WebSocket(`${online.production_server_url}${SYS_Data.arena_data.user_data.id}`); };
   
    //When we connect to the server for the first time
    online.server.addEventListener('open',function(event)
    {
        online.server_interval = setInterval(function()
        {
            //Send the battledata_id to the server to detect
            //the current status of the battle
            //In ONLINE the server_message is captured 
            //on server message event
            server_input = getServerInput("check")
            online.server.send(JSON.stringify(server_input));

            if(typeof(online.server_message) === "object")
            {   
                //Get the check result
                if(online.server_message.title === "check_result" && online.server_message.body.result === 0)
                {   
                    server_input = getServerInput("join");
                    online.server.send(JSON.stringify(server_input));
                }
                else if(online.server_message.title === "check_result" && online.server_message.body.result === 1)
                {
                    if( SYS_Data.arena_data.user_data.id === online.server_message.body.battledata.player1.id ||
                        SYS_Data.arena_data.user_data.id === online.server_message.body.battledata.player2.id )
                    {
                        SYS_Data.arena_data.battledata = online.server_message.body.battledata;
                    
                        //Lets detect if the ARENA_Core.initialized() has
                        //already been started so tha it can only run once
                        try{ document.getElementById("arena_battleground_layout_div").innerHTML; }catch(e)
                        {
                            ARENA_Core.initializeInterface();
                        };
                        //Update the ARENA
                        try{ 
                            //Use battleover than gameover to ensure the arena result will show
                           //but dont remove the gameover in the Server because it is still important
                           if(SYS_Data.arena_data.battledata.core.status === "battleover")
                           {
                               ARENA_Result.initialize(SYS_Data.arena_data.battledata,SYS_Data.arena_data.user_data);
                               
                               if(SYS_Data.game.current_interface === "arena_result")
                               {
                                   //Only stop the server_interval if the arena result showed
                                   //up. Because if you change tab or change window the arena
                                   //result will not show up if it is interrupted at the 
                                   //transition part.
                                   clearInterval(online.server_interval);
                               };
                           }
                           else
                           { 
                               ARENA_Core.updateInterface();
           
                               server_input = getServerInput("update");
                               online.server.send(JSON.stringify(server_input));
                           };
                       }catch(error)
                       {
                           //If there something return in the returned battledata
                           //then proceed to RESULT INTERFACE
                           console.log(error);
                           ARENA_Result.initialize(error.message);
    
                           if(SYS_Data.game.current_interface === "arena_result")
                           {
                               //Only stop the server_interval if the arena result showed
                               //up. Because if you change tab or change window the arena
                               //result will not show up if it is interrupted at the 
                               //transition part.
                               clearInterval(online.server_interval);
                           };
                       };  
                    }
                    else
                    {
                        //If the user id does not match to player1 or player2 id
                        //it means the user is not yet matched
                        //This bug does not happen offline
                        server_input = getServerInput("join");
                        online.server.send(JSON.stringify(server_input));
                    };
                };
            };
    
        },10);
    });

    //Receive server message here not on the interval.
    online.server.addEventListener('message', function(event)
    {
        online.server_message = event.data;
        online.server_message = JSON.parse(online.server_message);
    });

    //Get error
    online.server.addEventListener('error', function(event)
    {
        ARENA_ONLINE_ErrorConnection.initialize();
    });

    //Get close
    online.server.addEventListener('close', function(event)
    {
        ARENA_ONLINE_ErrorConnection.initialize();
    });
    

};

function getServerInput(mode)
{
    switch(mode)
    {
        case "check":
            return {
                title:"check",
                body:
                {
                    player_id:SYS_Data.arena_data.user_data.id
                }
            };
        break;
        case "join":
            return {
                title:"join",
                body:
                {
                    user_data:SYS_Data.arena_data.user_data
                }
            };
        break;
        case "update":
            return {
                title:"update",
                body:
                {
                    player_id: SYS_Data.arena_data.user_data.id,
                    controls_data: SYS_Data.arena_data.controls_data
                }
            };
        break;
    };
};

function createInterface(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(SYS_Data.game.orientation === "portrait")
    {
        v.image_width = v.holder_width * 0.70;
        v.image_height = v.holder_height * 0.10;

        v.margin = "20%";
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        v.image_width = v.holder_width * 0.45;
        v.image_height = v.holder_height * 0.15;

        v.margin = "10%"
    };

    SYS_UI.create([
        {
            type:"div", 
            id:"arena_online_main_div", 
            attach:div_holder,
            style:{
                width: v.holder_width.toString() + "px",
                height: v.holder_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                background:"transparent",
                backgroundImage:`url( ${ DATA_Image.getImage({name:"game_background",w:v.holder_width,h:v.holder_height}) })`,
                backgroundSize:  v.holder_width.toString() + "px" + " " +  v.holder_height.toString() + "px"
            }
        },
        {
            type:"div", 
            id:"arena_online_image", 
            attach:"arena_online_main_div",
            style:{
                width: v.image_width.toString() + "px",
                height: v.image_height.toString() + "px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_Image.getImage({name:"text_connecting",w:v.image_width,h:v.image_height}) })`,
                backgroundSize:  v.image_width.toString() + "px" + " " +  v.image_height.toString() + "px"
            }
        },
    ]);

};

return f;}());var BLESSINGS = (function(){var f ={};

f.getInitialStats = function(blessing_name)
{
    switch(blessing_name)
    {
        case "bl01": return BLESSING_01.getStats(); break;
        default: return BLESSING_00.getStats(); break;
    };
};

f.getSpellStats = function(blessing_name,spell_indexes)
{
    switch(blessing_name)
    {
        case "bl01": return BLESSING_01.getSpellStats(spell_indexes); break;
        default: return BLESSING_00.getSpellStats(spell_indexes); break;
    };
};

return f;}());var CHARACTERS = (function(){var f ={};

f.create = function(player_owner,character_name,battledata)
{   
    switch(character_name)
    {
        case "character_01": return CHARACTER_01.create(player_owner,battledata); break;
        default: alert(character_name + " does not exist"); return battledata; break;
    };
};

f.update = function(action,entity,battledata)
{
    switch(entity.info.name)
    {
        case "character_01": return CHARACTER_01.update(action,entity,battledata); break;
        default: alert(entity.info.name + " does not exist"); return battledata; break;
    };
};

f.getEnvironment = function(character_name,player)
{
    switch(character_name)
    {
        case "character_01": return CHARACTER_01.environment(player); break;
        default: alert(character_name + " does not exist"); return battledata; break;
    };
    
};

return f;}());const GAME_SPRITE = {
  "frames": {
    "environment_default_both.png": {
      "frame": {
        "x": 1,
        "y": 1,
        "w": 2553,
        "h": 5103
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 2553,
        "h": 5103
      },
      "sourceSize": {
        "w": 2553,
        "h": 5103
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_fire_beam_left_idle_5.png": {
      "frame": {
        "x": 2556,
        "y": 1,
        "w": 1532,
        "h": 227
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 1532,
        "h": 227
      },
      "sourceSize": {
        "w": 1532,
        "h": 227
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_fire_beam_right_idle_5.png": {
      "frame": {
        "x": 2556,
        "y": 230,
        "w": 1532,
        "h": 227
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 1532,
        "h": 227
      },
      "sourceSize": {
        "w": 1532,
        "h": 227
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_shield_blue_both_idle_0.png": {
      "frame": {
        "x": 2556,
        "y": 459,
        "w": 556,
        "h": 556
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 556,
        "h": 556
      },
      "sourceSize": {
        "w": 556,
        "h": 556
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_fire_beam_left_idle_4.png": {
      "frame": {
        "x": 2556,
        "y": 1017,
        "w": 1277,
        "h": 228
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 1277,
        "h": 228
      },
      "sourceSize": {
        "w": 1277,
        "h": 228
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_fire_beam_right_idle_4.png": {
      "frame": {
        "x": 2556,
        "y": 1247,
        "w": 1277,
        "h": 228
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 1277,
        "h": 228
      },
      "sourceSize": {
        "w": 1277,
        "h": 228
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_fire_beam_left_idle_3.png": {
      "frame": {
        "x": 2556,
        "y": 1477,
        "w": 1022,
        "h": 228
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 1022,
        "h": 228
      },
      "sourceSize": {
        "w": 1022,
        "h": 228
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_fire_beam_right_idle_3.png": {
      "frame": {
        "x": 2556,
        "y": 1707,
        "w": 1022,
        "h": 228
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 1022,
        "h": 228
      },
      "sourceSize": {
        "w": 1022,
        "h": 228
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_replenish_both_idle_2.png": {
      "frame": {
        "x": 3114,
        "y": 459,
        "w": 427,
        "h": 426
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 427,
        "h": 426
      },
      "sourceSize": {
        "w": 427,
        "h": 426
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_recharge_both_idle_2.png": {
      "frame": {
        "x": 3543,
        "y": 459,
        "w": 426,
        "h": 426
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 426,
        "h": 426
      },
      "sourceSize": {
        "w": 426,
        "h": 426
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_replenish_both_idle_3.png": {
      "frame": {
        "x": 3580,
        "y": 1477,
        "w": 426,
        "h": 426
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 426,
        "h": 426
      },
      "sourceSize": {
        "w": 426,
        "h": 426
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_recharge_both_idle_0.png": {
      "frame": {
        "x": 3580,
        "y": 1905,
        "w": 426,
        "h": 426
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 426,
        "h": 426
      },
      "sourceSize": {
        "w": 426,
        "h": 426
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_replenish_both_idle_0.png": {
      "frame": {
        "x": 2556,
        "y": 1937,
        "w": 426,
        "h": 426
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 426,
        "h": 426
      },
      "sourceSize": {
        "w": 426,
        "h": 426
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_replenish_both_idle_1.png": {
      "frame": {
        "x": 2984,
        "y": 1937,
        "w": 426,
        "h": 426
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 426,
        "h": 426
      },
      "sourceSize": {
        "w": 426,
        "h": 426
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_recharge_both_idle_1.png": {
      "frame": {
        "x": 3412,
        "y": 2333,
        "w": 426,
        "h": 426
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 426,
        "h": 426
      },
      "sourceSize": {
        "w": 426,
        "h": 426
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_recharge_both_idle_3.png": {
      "frame": {
        "x": 2556,
        "y": 2365,
        "w": 426,
        "h": 426
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 426,
        "h": 426
      },
      "sourceSize": {
        "w": 426,
        "h": 426
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_fire_beam_right_idle_2.png": {
      "frame": {
        "x": 2984,
        "y": 2761,
        "w": 767,
        "h": 227
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 767,
        "h": 227
      },
      "sourceSize": {
        "w": 767,
        "h": 227
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_fire_beam_left_idle_2.png": {
      "frame": {
        "x": 2556,
        "y": 2990,
        "w": 767,
        "h": 227
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 767,
        "h": 227
      },
      "sourceSize": {
        "w": 767,
        "h": 227
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "character_01_left_attack_1.png": {
      "frame": {
        "x": 3325,
        "y": 2990,
        "w": 460,
        "h": 344
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 460,
        "h": 344
      },
      "sourceSize": {
        "w": 460,
        "h": 344
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "character_01_right_attack_1.png": {
      "frame": {
        "x": 2556,
        "y": 3219,
        "w": 460,
        "h": 344
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 460,
        "h": 344
      },
      "sourceSize": {
        "w": 460,
        "h": 344
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "character_01_right_run_1.png": {
      "frame": {
        "x": 2984,
        "y": 2365,
        "w": 398,
        "h": 375
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 398,
        "h": 375
      },
      "sourceSize": {
        "w": 398,
        "h": 375
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "character_01_right_run_0.png": {
      "frame": {
        "x": 3018,
        "y": 3336,
        "w": 398,
        "h": 375
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 398,
        "h": 375
      },
      "sourceSize": {
        "w": 398,
        "h": 375
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "character_01_left_run_1.png": {
      "frame": {
        "x": 2556,
        "y": 3565,
        "w": 398,
        "h": 375
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 398,
        "h": 375
      },
      "sourceSize": {
        "w": 398,
        "h": 375
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "character_01_right_run_3.png": {
      "frame": {
        "x": 3418,
        "y": 3336,
        "w": 398,
        "h": 375
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 398,
        "h": 375
      },
      "sourceSize": {
        "w": 398,
        "h": 375
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "character_01_right_run_2.png": {
      "frame": {
        "x": 2956,
        "y": 3713,
        "w": 398,
        "h": 375
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 398,
        "h": 375
      },
      "sourceSize": {
        "w": 398,
        "h": 375
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "character_01_left_run_3.png": {
      "frame": {
        "x": 2556,
        "y": 3942,
        "w": 398,
        "h": 375
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 398,
        "h": 375
      },
      "sourceSize": {
        "w": 398,
        "h": 375
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "character_01_left_run_2.png": {
      "frame": {
        "x": 3356,
        "y": 3713,
        "w": 398,
        "h": 375
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 398,
        "h": 375
      },
      "sourceSize": {
        "w": 398,
        "h": 375
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "character_01_left_run_0.png": {
      "frame": {
        "x": 2956,
        "y": 4090,
        "w": 398,
        "h": 375
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 398,
        "h": 375
      },
      "sourceSize": {
        "w": 398,
        "h": 375
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "character_01_left_attack_0.png": {
      "frame": {
        "x": 3356,
        "y": 4090,
        "w": 402,
        "h": 343
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 402,
        "h": 343
      },
      "sourceSize": {
        "w": 402,
        "h": 343
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "character_01_right_attack_2.png": {
      "frame": {
        "x": 3356,
        "y": 4435,
        "w": 402,
        "h": 343
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 402,
        "h": 343
      },
      "sourceSize": {
        "w": 402,
        "h": 343
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "character_01_left_attack_2.png": {
      "frame": {
        "x": 2556,
        "y": 4467,
        "w": 402,
        "h": 343
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 402,
        "h": 343
      },
      "sourceSize": {
        "w": 402,
        "h": 343
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "character_01_right_attack_0.png": {
      "frame": {
        "x": 3756,
        "y": 3713,
        "w": 402,
        "h": 343
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 402,
        "h": 343
      },
      "sourceSize": {
        "w": 402,
        "h": 343
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "character_01_left_idle_0.png": {
      "frame": {
        "x": 2960,
        "y": 4467,
        "w": 342,
        "h": 360
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 342,
        "h": 360
      },
      "sourceSize": {
        "w": 342,
        "h": 360
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "character_01_right_idle_0.png": {
      "frame": {
        "x": 3835,
        "y": 887,
        "w": 342,
        "h": 360
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 342,
        "h": 360
      },
      "sourceSize": {
        "w": 342,
        "h": 360
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_fire_beam_left_idle_1.png": {
      "frame": {
        "x": 3971,
        "y": 459,
        "w": 512,
        "h": 228
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 512,
        "h": 228
      },
      "sourceSize": {
        "w": 512,
        "h": 228
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_fire_beam_right_idle_1.png": {
      "frame": {
        "x": 3304,
        "y": 4780,
        "w": 512,
        "h": 228
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 512,
        "h": 228
      },
      "sourceSize": {
        "w": 512,
        "h": 228
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_root_both_idle_2.png": {
      "frame": {
        "x": 3835,
        "y": 1249,
        "w": 427,
        "h": 214
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 427,
        "h": 214
      },
      "sourceSize": {
        "w": 427,
        "h": 214
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_root_both_idle_1.png": {
      "frame": {
        "x": 3753,
        "y": 2761,
        "w": 426,
        "h": 214
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 426,
        "h": 214
      },
      "sourceSize": {
        "w": 426,
        "h": 214
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_root_both_idle_0.png": {
      "frame": {
        "x": 2556,
        "y": 4829,
        "w": 426,
        "h": 214
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 426,
        "h": 214
      },
      "sourceSize": {
        "w": 426,
        "h": 214
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_fire_beam_right_idle_0.png": {
      "frame": {
        "x": 2984,
        "y": 4829,
        "w": 257,
        "h": 228
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 257,
        "h": 228
      },
      "sourceSize": {
        "w": 257,
        "h": 228
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_fire_beam_left_idle_0.png": {
      "frame": {
        "x": 4179,
        "y": 689,
        "w": 257,
        "h": 228
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 257,
        "h": 228
      },
      "sourceSize": {
        "w": 257,
        "h": 228
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_explode_fire_both_idle_4.png": {
      "frame": {
        "x": 3971,
        "y": 689,
        "w": 121,
        "h": 126
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 121,
        "h": 126
      },
      "sourceSize": {
        "w": 121,
        "h": 126
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_explode_fire_both_idle_3.png": {
      "frame": {
        "x": 2556,
        "y": 4319,
        "w": 111,
        "h": 117
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 111,
        "h": 117
      },
      "sourceSize": {
        "w": 111,
        "h": 117
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_explode_fire_both_idle_5.png": {
      "frame": {
        "x": 3018,
        "y": 3219,
        "w": 111,
        "h": 108
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 111,
        "h": 108
      },
      "sourceSize": {
        "w": 111,
        "h": 108
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_explode_fire_both_idle_2.png": {
      "frame": {
        "x": 3131,
        "y": 3219,
        "w": 90,
        "h": 97
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 90,
        "h": 97
      },
      "sourceSize": {
        "w": 90,
        "h": 97
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_explode_fire_both_idle_1.png": {
      "frame": {
        "x": 3223,
        "y": 3219,
        "w": 81,
        "h": 77
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 81,
        "h": 77
      },
      "sourceSize": {
        "w": 81,
        "h": 77
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_explode_fire_both_idle_0.png": {
      "frame": {
        "x": 3971,
        "y": 817,
        "w": 66,
        "h": 66
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 66,
        "h": 66
      },
      "sourceSize": {
        "w": 66,
        "h": 66
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_energy_ball_both_idle_0.png": {
      "frame": {
        "x": 4039,
        "y": 817,
        "w": 64,
        "h": 64
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 64,
        "h": 64
      },
      "sourceSize": {
        "w": 64,
        "h": 64
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_explode_fire_both_idle_6.png": {
      "frame": {
        "x": 2956,
        "y": 3565,
        "w": 52,
        "h": 54
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 52,
        "h": 54
      },
      "sourceSize": {
        "w": 52,
        "h": 54
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_explode_fire_both_idle_7.png": {
      "frame": {
        "x": 2956,
        "y": 3621,
        "w": 37,
        "h": 41
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 37,
        "h": 41
      },
      "sourceSize": {
        "w": 37,
        "h": 41
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_rain_of_fire_left_idle_0.png": {
      "frame": {
        "x": 2956,
        "y": 3664,
        "w": 39,
        "h": 25
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 39,
        "h": 25
      },
      "sourceSize": {
        "w": 39,
        "h": 25
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    },
    "sfx_rain_of_fire_right_idle_0.png": {
      "frame": {
        "x": 3223,
        "y": 3298,
        "w": 39,
        "h": 25
      },
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {
        "x": 0,
        "y": 0,
        "w": 39,
        "h": 25
      },
      "sourceSize": {
        "w": 39,
        "h": 25
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    }
  },
  "meta": {
    "app": "http://free-tex-packer.com",
    "version": "0.6.7",
    "image": "game_sprite.png",
    "format": "RGBA8888",
    "size": {
      "w": 4484,
      "h": 5105
    },
    "scale": 1
  }
}
;var PHASES = (function(){var f ={};

f.initialize = function(battledata)
{
    battledata.private.phases.stage = 0;
    battledata.private.phases.initialized = false;

    return battledata;
};

f.update = function(battledata)
{
    switch(battledata.private.phases.stage)
    {
        case 0: battledata = PHASE_0.run(battledata); break;
        case 1: battledata = PHASE_1.run(battledata); break;
        case 2: battledata = PHASE_2.run(battledata); break;
        case 3: battledata = PHASE_3.run(battledata); break;
    };

    return battledata;
};

return f;}());var PHASE_Template = (function(){var f ={};

f.run = function(battledata)
{
    if(battledata.private.phases.initialized === false)
    {
        battledata.private.phases.initialized = true;
        battledata = initialize(battledata);
    };

    if(battledata.private.phases.initialized === true)
    {
        battledata = update(battledata);
    };

    return battledata;
};

function initialize(battledata)
{   
    return battledata;
};

function update(battledata)
{
    if(ENGINE_Utils.rng(1,100) >= 50)
    {
        battledata = end(battledata);
    };
    
    return battledata;
};

function end(battledata)
{

    battledata.private.phases.initialized = false;
    battledata.private.phases.stage = 1;

    return battledata;
};


return f;}());var SFX = (function(){var f ={};

f.create = function(player_owner,sfx_name,sfx_data)
{   
    switch(sfx_name)
    {
        case "sfx_explode_fire": return SFX_ExplodeFire.create(player_owner,sfx_data); break;
        case "sfx_recharge": return SFX_Recharge.create(player_owner,sfx_data); break;
        case "sfx_replenish": return SFX_Replenish.create(player_owner,sfx_data); break;
        case "sfx_root": return SFX_Root.create(player_owner,sfx_data); break;
        default: alert(sfx_name + " does not exist"); break;
    };
};

f.genericUpdate = function(entity,battledata)
{
    switch(entity.info.name)
    {
        case "sfx_explode_fire": return SFX_ExplodeFire.genericUpdate(entity,battledata); break;
        case "sfx_recharge": return SFX_Recharge.genericUpdate(entity,battledata); break;
        case "sfx_replenish": return SFX_Replenish.genericUpdate(entity,battledata); break;
        case "sfx_root": return SFX_Root.genericUpdate(entity,battledata); break;
        default: alert(entity.info.name + " does not exist"); break;
    };
};

return f;}());var SPELLS = (function(){var f ={};

f.getSpellStats = function(spells)
{
    var spell_stats = [];
    var stats = {};

    for(var i = 0; i <= spells.length - 1;i++)
    {
        switch(spells[i])
        {
            case "sp01": stats = SPELL_01.getSpellStats();  spell_stats.push(stats); break;
            case "sp02": stats = SPELL_02.getSpellStats();  spell_stats.push(stats); break;
            case "sp03": stats = SPELL_03.getSpellStats();  spell_stats.push(stats); break;
            case "sp04": stats = SPELL_04.getSpellStats();  spell_stats.push(stats); break;
            default: stats = SPELL_00.getSpellStats(stats);  spell_stats.push(stats); break;
        };
    };

    return spell_stats;
};

f.getSpellSpeed = function(spell_id,player,battledata)
{
    switch(spell_id)
    {
        case "sp01": return SPELL_01.getSpeed(player,battledata); break;
        case "sp02": return SPELL_02.getSpeed(player,battledata); break;
        case "sp03": return SPELL_03.getSpeed(player,battledata); break;
        case "sp04": return SPELL_04.getSpeed(player,battledata); break;
        default: return SPELL_00.getSpeed(player,battledata); break;
    };
};

f.start = function(player_owner,spell_id,battledata)
{
    switch(spell_id)
    {
        case "sp01": return SPELL_01.start(player_owner,battledata); break;
        case "sp02": return SPELL_02.start(player_owner,battledata); break;
        case "sp03": return SPELL_03.start(player_owner,battledata); break;
        case "sp04": return SPELL_04.start(player_owner,battledata); break;
        default: return SPELL_00.start(player_owner,battledata); break;
    };
};

f.genericUpdate = function(entity,battledata)
{   
    switch(entity.info.name)
    {
        case "sp01": return SPELL_01.genericUpdate(entity,battledata); break;
        case "sp02": return SPELL_02.genericUpdate(entity,battledata); break;
        case "sp03": return SPELL_03.genericUpdate(entity,battledata); break;
        case "sp04": return SPELL_04.genericUpdate(entity,battledata); break;
        default: return SPELL_00.genericUpdate(entity,battledata); break; 
    };
};


return f;}());var STATUS = (function(){var f ={};

f.addStatus = function(status_name,player_target,battledata,params)
{
    switch(status_name)
    {
        case "status_recharge": return STATUS_Recharge.add(player_target,battledata,params); break;
        case "status_root": return STATUS_Root.add(player_target,battledata,params); break;
        case "status_replenish": return STATUS_Replenish.add(player_target,battledata,params); break;
        case "status_sample1": return STATUS_Sample1.add(player_target,battledata,params); break;
        case "status_sample2": return STATUS_Sample2.add(player_target,battledata,params); break;
        case "status_sample3": return STATUS_Sample3.add(player_target,battledata,params); break;
        case "status_sample4": return STATUS_Sample4.add(player_target,battledata,params); break;
        case "status_sample5": return STATUS_Sample5.add(player_target,battledata,params); break;
        case "status_sample6": return STATUS_Sample6.add(player_target,battledata,params); break;
        default: alert(status_name + " does not exist"); return battledata; break;
    };
};

f.insertNewStatus = function(player_status,new_status,battledata)
{
    if(player_status.length < battledata.private.core.max_status_number)
    {
        player_status.push(new_status);
    };

    return player_status;
};

f.checkStatus = function(mode,player_status,params)
{
    switch(mode)
    {
        case "do_exist":
            var do_exist = [];
            for(var i = 0; i <= player_status.length - 1;i++)
            {
                if(player_status[i].name === params.target_status)
                {
                    do_exist.push(i);
                }; 
            };
            return do_exist;
        break;
        default: alert(mode + " does not exist"); break;
    };
};

f.activateStatus =  function(status_name,player_owner,battledata)
{
    switch(status_name)
    {
        case "status_recharge": battledata = STATUS_Recharge.activate(player_owner,battledata); break;
        case "status_root": battledata = STATUS_Root.activate(player_owner,battledata); break;
        case "status_replenish": battledata = STATUS_Replenish.activate(player_owner,battledata); break;
        case "status_sample1": battledata = STATUS_Sample1.activate(player_owner,battledata); break;
        case "status_sample2": battledata = STATUS_Sample2.activate(player_owner,battledata); break;
        case "status_sample3": battledata = STATUS_Sample3.activate(player_owner,battledata); break;
        case "status_sample4": battledata = STATUS_Sample4.activate(player_owner,battledata); break;
        case "status_sample5": battledata = STATUS_Sample5.activate(player_owner,battledata); break;
        case "status_sample6": battledata = STATUS_Sample6.activate(player_owner,battledata); break;
        default: alert(status_name + " does not exist"); break;
    };

    return battledata;
};


return f;}());window.onload = function()
{
    var load_check_interval = setInterval(function()
    {
        if(window.innerWidth >= 1 && window.innerHeight >= 1)
        {
            //Initialize Client
           SYS_Initializer.start();

           //This needs to be activated 
           //before the server to be activated
           //so that we can use previous data
           ENGINE_Offline_LocalStorage.initialize();

           //Start the Engine
           SERVER_GATE.initialize();

            clearInterval(load_check_interval);
        };
    },1);

};/*This comment was created to prevent the white square from popping up and causing error.*/ 
