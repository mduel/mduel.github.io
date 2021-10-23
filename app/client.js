var AI_ARENA_Core = (function(){var f ={};

f.arena_data = 
{
     user_data:{},
     battledata_id:"",
     battledata:{},
     controls_data:
     {
          spell_selected:0,
          previous_spell_selected:0,
          position_selected:0,
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
            spell_selected:0,
            position_selected:0,
        },
    };
 
    //Prepare player data
    f.arena_data.user_data = 
    {
        id:SYS_Utils.idGenerator(20),
        name:"Computer Player",
        character:"character_01",
        spells:["sp00","sp01","sp02","sp03","sp04"],//sp00 will always be at index 0
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
    var mode1 = 2;

    switch(mode1)
    {
        case 0:
            f.arena_data.controls_data.spell_selected = 0;
        break;
        case 1:
            f.arena_data.controls_data.spell_selected = SYS_Utils.rng(1,4);
        break;
        case 2:
            f.arena_data.controls_data.spell_selected = 1;
        break;
    };

    var mode2 = 0;

    switch(mode2)
    {
        case 0:
            f.arena_data.controls_data.position_selected = 0;
        break;
        case 1:
            f.arena_data.controls_data.position_selected = SYS_Utils.rng(1,2);
        break;
        case 2:
            f.arena_data.controls_data.position_selected = 1;
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
    ARENA_Module_Position.create("arena_control_position_div");
    ARENA_Module_Spells.create("arena_control_spells_div");
    ARENA_Module_Options.create("arena_control_options_div");
    
    //10TH STEP
    ARENA_Module_Battleground.create("arena_battleground_layout_div");

    //Show performance panel for debug purposes
    if(SYS_Data.game.show_performance_panel === true)
    {
        var stats = new Stats();
        stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( stats.dom );
        requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});
    };

};

f.updateInterface = function()
{
    if(SYS_Data.game.arena_windowinfo_visible === false)
    {
        ARENA_Module_Time.update();
        ARENA_Module_PlayerData.update();
        ARENA_Module_PlayerStatus.update();
        ARENA_Module_Battleground.update();
        ARENA_Module_Spells.update();
        ARENA_Module_Position.update();
    };
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
        v.background_image  = DATA_UI.getImage("game_background");
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        v.background_image  = DATA_UI.getImage("game_background");
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

    v.control_position_div_width = v.holder_width  * 0.20;
    v.control_position_div_height = v.holder_height;

    v.control_temp_div_width = v.holder_width  * 0.80;
    v.control_temp_div_height = v.holder_height;

    v.control_spells_div_width = v.control_temp_div_width;
    v.control_spells_div_height = v.control_temp_div_height * 0.70;

    v.control_options_div_width = v.control_temp_div_width;
    v.control_options_div_height = v.control_temp_div_height * 0.30;


    SYS_UI.style([{
        id:"arena_control_layout_div",
        display:"flex",
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
    }]);

    SYS_UI.create([
        {
            type:"div",
            id:"arena_control_position_div",
            attach:div_holder,
            style:{
                width:v.control_position_div_width.toString() + "px",
                height:v.control_position_div_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
            }
        },
        {
            type:"div",
            id:"arena_control_temp_div",
            attach:div_holder,
            style:{
                width:v.control_temp_div_width.toString() + "px",
                height:v.control_temp_div_height.toString() + "px",
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
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
            }
        },
        {
            type:"div",
            id:"arena_control_options_div",
            attach:"arena_control_temp_div",
            style:{
                width:v.control_options_div_width.toString() + "px",
                height:v.control_options_div_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
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

    v.control_position_div_width = v.control_temp_div_width * 0.50;
    v.control_position_div_height = v.control_temp_div_height;

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
        },
        {
            type:"div",
            id:"arena_control_position_div",
            attach:"arena_control_temp_div",
            style:{
                width:v.control_position_div_width.toString() + "px",
                height:v.control_position_div_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
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

return f;}());var ARENA_Module_Battleground = (function(){var f ={};

var environment_created = false;

f.tile_contents = [];

f.create = function(div_holder)
{
    //Allow to create environment again
    environment_created = false;

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

    f.tile_contents = [];

    v.row_count = 3;
    v.column_count = 4;

    v.tile_width = v.holder_width / v.column_count;
    v.tile_height = v.holder_height / v.row_count;

    SYS_UI.create([
        {
            type:"table", 
            id:"arena_battleground_table", 
            attach:div_holder,
            style:
            {
                borderCollapse:"collapse",
                background:"transparent",
                background:`url( ${ DATA_UI.getImage("game_background") } )`,
                backgroundSize:  v.holder_width.toString() + "px" + " " +  v.holder_height.toString() + "px",
            }
        }
    ]); 
    
    for(var r = 0; r <= v.row_count - 1;r++)
    {
        f.tile_contents.push([]);

        SYS_UI.create([
            {
                type:"tr", 
                id:"arena_battleground_table_tr"+r,
                attach:"arena_battleground_table",
               
            }
        ]);  
        
        for(var c = 0; c <= v.column_count-1;c++)
        {
            f.tile_contents[r].push([]);

            SYS_UI.create([
                {
                    type:"td", 
                    id:"arena_battleground_table_tr"+r+"td"+c,
                    attach:"arena_battleground_table_tr"+r,
                    
                },
                {
                    type:"div",
                    id: "arena_battleground_tile_tr"+r+"_td"+c,
                    attach:"arena_battleground_table_tr"+r+"td"+c,
                    style:{
                        width:v.tile_width.toString() + "px",
                        height:v.tile_height.toString() + "px",
                        position:"relative",
                        border:"1px solid black"
                    }
                }
            ]);  
            
            for(var i = 0; i <= 10;i++)
            {
                f.tile_contents[r][c].push(false); 

                SYS_UI.create([
                    {
                        type:"div",
                        id: "arena_battleground_entity_"+c+"_"+r+"_"+i, //r= y axis c = x axis
                        attach:"arena_battleground_tile_tr"+r+"_td"+c,
                        style:{
                            width:v.tile_width.toString() + "px",
                            height:v.tile_height.toString() + "px",
                            position:"absolute",
                            top:"0px",
                            left:"0px",
                            backgroundColor:"red"
                        }
                    }
                ]); 
            };
            
        };
    };
    
};

f.update = function()
{
    var battledata = SYS_Data.arena_data.battledata;

    //Always render environment first
    if(environment_created === false)
    {
        //environment_created = true;
        ARENA_Renderer.render_environment("arena_battleground_table",battledata);
    };

    
    //Clear the interface before adding any entities
    ARENA_Renderer.render_clear();
    
    //UPDATE THE ENVIRONMENT, CHARACTERS, SFX
    if(typeof(battledata.core.entities) === "object")
    {
        for(var i = 0; i <= battledata.core.entities.length - 1;i++)
        {
            if(Object.keys(battledata.core.entities[i]).length >= 1)
            {
                if(battledata.core.entities[i].info.class === "character") 
                {
                    ARENA_Renderer.render_entity("characters",battledata.core.entities[i]);
                }
                else
                {
                    ARENA_Renderer.render_entity("sfx",battledata.core.entities[i]);
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
    ARENA_WindowInfo_Options.initialize();
};

function createOptionsPortrait(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    v.option_button_width = v.holder_width * 0.30;
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
    
};

function createDivs(div_holder,player_tag)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    //Width is the same in any orientation
    v.player_div_name_height = v.holder_height * 0.15;
    v.player_div_health_height = v.holder_height * 0.15;
    v.player_div_status_height = v.holder_height * 0.70;


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
            id:"arena_"+player_tag+"_div_health",
            attach:div_holder,
            style:{
                width:v.holder_width.toString() + "px",
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
        }
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

f.update = function()
{
    var battledata = SYS_Data.arena_data.battledata;

    //UPDATE THE NAME
    document.getElementById("arena_player1_text_name").innerHTML = battledata.player1.name;
    document.getElementById("arena_player2_text_name").innerHTML = battledata.player2.name;

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

    v.table_tr_height = (v.holder_height / 4) * 0.95;
    v.table_td_width = (v.holder_width / 2) * 0.95;
    v.status_holder_height = v.table_tr_height;
    v.status_holder_width = v.table_td_width;
    v.status_icon_height = v.status_holder_height * 0.70;
    v.status_icon_width = v.status_holder_width * 0.60;
    v.status_code_size = (Math.sqrt(v.status_holder_width * v.status_icon_height)) * 0.40;
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

    for(var tr = 0; tr <= 3; tr++)
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
        for(var i = 1; i <= 8;i++)
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

return f;}());var ARENA_Module_Position = (function(){var f ={};

f.create = function(div_holder)
{
    //Clear the interface first before adding anything
    SYS_UI.clear({id:div_holder});

    //Now create the buttons
    createPosition(div_holder);

};

f.position_selected = function(button_position)
{
    if(button_position === SYS_Data.arena_data.controls_data.position_selected)
    {
        SYS_Data.arena_data.controls_data.position_selected = 0;
    }
    else
    {
        SYS_Data.arena_data.controls_data.position_selected = parseInt(button_position);
    };
};

function createPosition(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    v.position_amount = 2;
    v.position_count = 0;

    v.position_holder_width = v.holder_width * 0.70;              
    v.position_holder_height = (v.holder_height / v.position_amount) * 0.70;

    if(v.position_holder_width >= v.position_holder_height)
    {
        v.position_holder_size = v.position_holder_height;
        v.position_image_size = v.position_holder_height * 0.70;
    }
    else if(v.position_holder_height > v.position_holder_width)
    {
        v.position_holder_size = v.position_holder_width;
        v.position_image_size = v.position_holder_width * 0.70;
    };

    for(var ac = 1; ac <= v.position_amount; ac++)
    {
        v.position_images = ["default","button_move_up","button_move_down"];
        v.position_count++;

        SYS_UI.create([
            {
                type:"div", 
                id:"arena_position_holder_"+v.position_count, 
                attach:div_holder,
                style:{
                    width: v.position_holder_size.toString() + "px",
                    height: v.position_holder_size.toString() + "px",
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
                    onclick:`ARENA_Module_Position.position_selected(${v.position_count});`,
                }
            },
            {
                type:"img",
                id:"arena_position_image_"+v.position_count,
                attach:"arena_position_holder_"+v.position_count, 
                attrib:{
                    src:DATA_UI.getImage(v.position_images[v.position_count])
                },
                style:{
                    width:v.position_image_size.toString() + "px",
                    height:v.position_image_size.toString() + "px",
                },
            },
        ]);    
    };
    
};

f.update = function()
{
    var battledata = SYS_Data.arena_data.battledata;
    var userdata = SYS_Data.arena_data.user_data;

    //RESET FIRST ALL THE BUTTONS
    for(var i = 1; i <= 2; i++)
    {
        SYS_UI.style([
            {
                id:"arena_position_holder_"+i,
                backgroundColor:"white"
            }
        ]);
    };

    //COLOR THE SELECTED BUTTONS
    if(SYS_Data.arena_data.controls_data.position_selected >= 1)
    {
        if(userdata.id === battledata.player1.id)
        {
            var color = "red";
        }
        else if(userdata.id === battledata.player2.id)
        {
            var color = "blue";
        }


        SYS_UI.style([
            {
                id:"arena_position_holder_"+SYS_Data.arena_data.controls_data.position_selected,
                backgroundColor:color
            }
        ]);
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
            ARENA_WindowInfo_Spell.initialize();
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
        //Check if the cooldown is zero for the selected spell
        //Then set the new spell selected to the current selected
        if(userdata.id === battledata.player1.id) { var player = battledata.player1; }
        else if(userdata.id === battledata.player2.id){ var player = battledata.player2; }

        if(player.spells[button_position].cooldown_current <= 0)
        {
            controls_data.spell_selected = button_position;
        }
        else if(player.spells[button_position].cooldown_current >= 1)
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
                    src:DATA_UI.getImage("default")
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
                    src:DATA_UI.getImage("default")
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

    //UPDATE THE COOLDOWN
    //Since we use indexing so we need to start at 1
    for(var i = 1; i <= 4; i++)
    {
        if(player.spells[i].cooldown_current <= 0)
        {
            SYS_UI.style([
                {
                    id:"arena_spell_indicator_"+(i),
                    display:"none"
                }
            ]);
        }
        else if(player.spells[i].cooldown_current >= 1)
        {
            var percent = (player.spells[i].cooldown_current / player.spells[i].cooldown_max) * 100;

            SYS_UI.style([
                {
                    id:"arena_spell_indicator_"+(i),
                    height:percent+"%",
                    bottom:"0px",
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
        if(player.spells[SYS_Data.arena_data.controls_data.spell_selected].cooldown_current <= 0)
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
    ARENA_Preparation.initialize();
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
                backgroundImage:`url( ${ DATA_UI.getImage("game_background") })`,
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
                backgroundImage:`url( ${ DATA_UI.getImage("text_connection_failed") })`,
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
                backgroundImage:`url( ${ DATA_UI.getImage("button_continue") })`,
                backgroundSize:  v.button_width.toString() + "px" + " " +  v.button_height.toString() + "px"
            },
            attrib:
            { 
                onclick:"ARENA_ONLINE_ErrorConnection.continue();"
            }
        },
    ]);

};

return f;}());var ARENA_Prep_Component_Layer0 = (function(){var f ={};

f.initialize = function(div_holder)
{
    //Create Measurement
    var v = createMeasurement(div_holder);

    //Render interface
    createInterface(v,div_holder);
    
};

function createMeasurement(div_holder)
{
    var v = {}; var w = 0; var h = 0; var m = 0;

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(SYS_Data.game.orientation === "portrait")
    {   
        w = v.holder_width * 0.12; 
        h = w * 0.65;
    
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        var ratio = v.holder_width / v.holder_height; 

        if( ratio <= 15) {
            w = v.holder_width * 0.08; 
            h = w * 0.50;
        } else if( ratio > 15 && ratio <= 20) {
            w = v.holder_width * 0.06; 
            h = w * 0.50;
        } else if( ratio > 20) {
            w = v.holder_width * 0.06; 
            h = w * 0.40;
        };
        
    };
    
    m = (v.holder_height - h) / 2;

    v.arena_prep_button_back = { width: w, height: h, margin: m, pos: m};
    v.arena_prep_button_settings = { width: w, height: h, margin: m, pos: m };
   
    return v;
};

function createInterface(v,div_holder)
{
    SYS_UI.create([
        {
            type:"button", 
            id:"arena_prep_button_back", 
            attach:div_holder,
            style:{
                width: v.arena_prep_button_back.width.toString() + "px",
                height: v.arena_prep_button_back.height.toString() + "px",
                marginTop: v.arena_prep_button_back.margin.toString() + "px",
                position: "absolute",
                left: v.arena_prep_button_back.pos.toString() + "px",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("button_back") } )`,
                backgroundSize:  v.arena_prep_button_back.width.toString() + "px" + " " +  v.arena_prep_button_back.height.toString() + "px"
            },
            attrib:
            { 
                onclick:""
            }
        },
        {
            type:"button", 
            id:"arena_prep_button_settings", 
            attach:div_holder,
            style:{
                width: v.arena_prep_button_settings.width.toString() + "px",
                height: v.arena_prep_button_settings.height.toString() + "px",
                marginTop: v.arena_prep_button_settings.margin.toString() + "px",
                position: "absolute",
                right: v.arena_prep_button_settings.pos.toString() + "px",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("button_settings") } )`,
                backgroundSize:  v.arena_prep_button_settings.width.toString() + "px" + " " +  v.arena_prep_button_settings.height.toString() + "px"
            },
            attrib:
            { 
                onclick:""
            }
        },
    ]);
};



return f;}());var ARENA_Prep_Component_Layer1 = (function(){var f ={};

f.initialize = function(div_holder)
{
    //Create Measurement
    var v = createMeasurement(div_holder);

    //Render interface
    createInterface(v,div_holder);
    
};

function createMeasurement(div_holder)
{
    var v = {}; var w = 0; var h = 0; var s = 0;

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);
    
    var ratio = v.holder_width / v.holder_height;

    if(SYS_Data.game.orientation === "portrait")
    {   
        if( ratio <= 3) {
            w = v.holder_width * 0.70; 
            h = w * 0.20;
        } else if( ratio > 3 && ratio <= 4) {
            w = v.holder_width * 0.55; 
            h = w * 0.20;
        } else if( ratio > 4) {
            w = v.holder_width * 0.40; 
            h = w * 0.18;
        };
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        if( ratio <= 10) {
            w = v.holder_width * 0.30; 
            h = w * 0.20;
        } else if( ratio > 10 && ratio <= 13) {
            w = v.holder_width * 0.25; 
            h = w * 0.20;
        } else if( ratio > 13) {
            w = v.holder_width * 0.25; 
            h = w * 0.18;
        };

    };
    
    v.arena_prep_input_name = 
    { 
        width: w, 
        height: h, 
        size: h * 0.55, 
        margin: v.holder_width * 0.01 
    };
   
    return v;
};

function createInterface(v,div_holder)
{
    SYS_UI.create([
        {
            type:"input", 
            id:"arena_prep_input_name", 
            attach:div_holder,
            attrib:
            {
                type:"text",
                value:SYS_Data.arena_data.user_data.name,
                placeholder:"Enter Name Here",
                maxlength:15,
                onchange:`SYS_Data.arena_data.user_data.name = document.getElementById('arena_prep_input_name').value`,
            },
            style:{
                width: v.arena_prep_input_name.width.toString() + "px",
                height: v.arena_prep_input_name.height.toString() + "px",
                margin: v.arena_prep_input_name.margin.toString() + "px",
                padding: v.arena_prep_input_name.margin.toString() + "px",
                fontSize: v.arena_prep_input_name.size.toString() + "px",
                fontWeight:"bold",
                backgroundColor:"white",
            }
        },
    ]);
};

return f;}());var ARENA_Prep_Component_Layer2 = (function(){var f ={};

f.initialize = function(div_holder)
{
    //Render interface
    createInterface(div_holder);

    //Create Loadout
    ARENA_Prep_Loadout_Character.interface("arena_prep_loadout_div_top");
    ARENA_Prep_Loadout_Spells.interface("arena_prep_loadout_div_bottom");
    
};

function createInterface(div_holder)
{
    var v = {}; 

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(SYS_Data.game.orientation === "portrait")
    {  
        SYS_UI.style([{id:div_holder, flexDirection:"column"}]);

        v.top_size = { width: v.holder_width, height: v.holder_height * 0.40, margin:0 };   
        v.bottom_size = { width: v.holder_width, height: v.holder_height * 0.60, margin:0 };   
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        SYS_UI.style([{id:div_holder, flexDirection:"row"}]); 

        v.top_size = { width: v.holder_width * 0.30, height: v.holder_height, margin:0 };   
        v.bottom_size = { width: v.holder_width * 0.30, height: v.holder_height, margin:0 }; 
    };

    SYS_UI.create([
        {
            type:"div", 
            id:"arena_prep_loadout_div_top", 
            attach:div_holder,
            style:{
                width: v.top_size.width.toString() + "px",
                height: v.top_size.height.toString() + "px",
                display:"flex",
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
            }
        },
        {
            type:"div", 
            id:"arena_prep_loadout_div_bottom", 
            attach:div_holder,
            style:{
                width: v.bottom_size.width.toString() + "px",
                height: v.bottom_size.height.toString() + "px",
                display:"flex",
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
            }
        },
    ]);
};

return f;}());var ARENA_Prep_Component_Layer3 = (function(){var f ={};

f.initialize = function(div_holder)
{
    //Create Measurement
    var v = createMeasurement(div_holder);

    //Render interface
    createInterface(v,div_holder);
    
};

function createMeasurement(div_holder)
{
    var v = {}; var w = 0; var h = 0; var m = 0;

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(SYS_Data.game.orientation === "portrait")
    {   
        w = v.holder_width * 0.40; 
        h = w * 0.40;
        m = w * 0.10;
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        w = v.holder_width * 0.20; 
        h = w * 0.40;
        m = w * 0.10;
    };
    
    v.arena_prep_button_offline = { width: w, height: h, margin: m };
    v.arena_prep_button_online = { width: w, height: h, margin: m };
   
    return v;
};

function createInterface(v,div_holder)
{
    SYS_UI.create([
        {
            type:"button", 
            id:"arena_prep_button_offline", 
            attach:div_holder,
            style:{
                width: v.arena_prep_button_offline.width.toString() + "px",
                height: v.arena_prep_button_offline.height.toString() + "px",
                margin: v.arena_prep_button_offline.margin.toString() + "px",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("button_offline") } )`,
                backgroundSize:  v.arena_prep_button_offline.width.toString() + "px" + " " +  v.arena_prep_button_offline.height.toString() + "px"
            },
            attrib:
            { 
                onclick:"ARENA_OFFLINE.initialize();"
            }
        },
        {
            type:"button", 
            id:"arena_prep_button_online", 
            attach:div_holder,
            style:{
                width: v.arena_prep_button_online.width.toString() + "px",
                height: v.arena_prep_button_online.height.toString() + "px",
                margin: v.arena_prep_button_online.margin.toString() + "px",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("button_online") } )`,
                backgroundSize:  v.arena_prep_button_online.width.toString() + "px" + " " +  v.arena_prep_button_online.height.toString() + "px"
            },
            attrib:
            { 
                onclick:"ARENA_ONLINE.initialize();"
            }
        },
    ]);
};



return f;}());var ARENA_Prep_Layout = (function(){var f ={};

f.initialize = function(div_holder)
{
    //Create layout
    createLayout(div_holder);
};

function createLayout(div_holder)
{
    var v = {}; var w = 0; var h = 0;

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);
    
    h = v.holder_height * 0.10;
    v.arena_prep_div_layer0 = { width: v.holder_width, height: h };
    h = v.holder_height * 0.15;
    v.arena_prep_div_layer1 = { width: v.holder_width, height: h };
    h = v.holder_height * 0.55;
    v.arena_prep_div_layer2 = { width: v.holder_width, height: h };
    h = v.holder_height * 0.20;
    v.arena_prep_div_layer3 = { width: v.holder_width, height: h };

    SYS_UI.create([
        {
            type:"div", 
            id:"arena_prep_div_main", 
            attach:div_holder,
            style:{
                width: v.holder_width.toString() + "px",
                height: v.holder_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("game_background") })`,
                backgroundSize:  v.holder_width.toString() + "px" + " " +  v.holder_height.toString() + "px"
            }
        },
        {
            type:"div", 
            id:"arena_prep_div_layer0", 
            attach:"arena_prep_div_main",
            style:{
                width: v.arena_prep_div_layer0.width.toString() + "px",
                height: v.arena_prep_div_layer0.height.toString() + "px",
            }
        },
        {
            type:"div", 
            id:"arena_prep_div_layer1", 
            attach:"arena_prep_div_main",
            style:{
                width: v.arena_prep_div_layer1.width.toString() + "px",
                height: v.arena_prep_div_layer1.height.toString() + "px",
                display:"flex",
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
            }
        },
        {
            type:"div", 
            id:"arena_prep_div_layer2", 
            attach:"arena_prep_div_main",
            style:{
                width: v.arena_prep_div_layer2.width.toString() + "px",
                height: v.arena_prep_div_layer2.height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
            }
        },
        {
            type:"div", 
            id:"arena_prep_div_layer3", 
            attach:"arena_prep_div_main",
            style:{
                width: v.arena_prep_div_layer3.width.toString() + "px",
                height: v.arena_prep_div_layer3.height.toString() + "px",
                display:"flex",
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
            }
        },
    ]);
};



return f;}());var ARENA_Prep_List_Spells = (function(){var f ={};

var list_measurements;
var list_spells = [];

f.initialize = function(spell_index)
{
    SYS_Data.arena_prep.player_spell_index = spell_index;

    //Clear the interface first before adding anything
    SYS_UI.clear({id:SYS_UI.body});

    //Create the div holders
    createLayout(SYS_UI.body);

    //Create the spells
    createTitle("arena_prep_list_div_layer0");
    createList("arena_prep_list_div_layer1");
    createControls("arena_prep_list_div_layer2");

    f.updateList('start');
};

f.select = function(spell_id)
{
    SYS_Data.arena_prep.selected_spell_id = spell_id;

    ARENA_Prep_Select_Spell.initialize();
};

function createLayout(div_holder)
{
    var v = {}; 

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(SYS_Data.game.orientation === "portrait")
    {  
        v.h1 = v.holder_height * 0.10;
        v.h2 = v.holder_height * 0.80;
        v.h3 = v.holder_height * 0.10;
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        v.h1 = v.holder_height * 0.20;
        v.h2 = v.holder_height * 0.60;
        v.h3 = v.holder_height * 0.20;
    };

    v.t = 0;
    v.arena_prep_list_div_layer0 = { width: v.holder_width, height: v.h1, top: v.t };

    v.t = v.h1;
    v.arena_prep_list_div_layer1 = { width: v.holder_width, height: v.h2, top: v.t };

    v.t = v.h1 + v.h2;
    v.arena_prep_list_div_layer2 = { width: v.holder_width, height: v.h3, top: v.t };
    

    SYS_UI.create([
        {
            type:"div", 
            id:"arena_prep_list_div_main", 
            attach:div_holder,
            style:{
                width: v.holder_width.toString() + "px",
                height: v.holder_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("game_background") })`,
                backgroundSize:  v.holder_width.toString() + "px" + " " +  v.holder_height.toString() + "px"
            }
        },
        {
            type:"div", 
            id:"arena_prep_list_div_layer0", 
            attach:"arena_prep_list_div_main",
            style:{
                width: v.arena_prep_list_div_layer0.width.toString() + "px",
                height: v.arena_prep_list_div_layer0.height.toString() + "px",
                display:"flex",
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
            }
        },
        {
            type:"div", 
            id:"arena_prep_list_div_layer1", 
            attach:"arena_prep_list_div_main",
            style:{
                width: v.arena_prep_list_div_layer1.width.toString() + "px",
                height: v.arena_prep_list_div_layer1.height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
            }
        },
        {
            type:"div", 
            id:"arena_prep_list_div_layer2", 
            attach:"arena_prep_list_div_main",
            style:{
                width: v.arena_prep_list_div_layer2.width.toString() + "px",
                height: v.arena_prep_list_div_layer2.height.toString() + "px",
                display:"flex",
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
            }
        },
       
    ]);
};

function createTitle(div_holder)
{
    var v = {}; var w = 0; var h = 0;

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);
    
    var ratio = v.holder_width / v.holder_height;

    if(SYS_Data.game.orientation === "portrait")
    {   
        if( ratio <= 5) {
            w = v.holder_width * 0.70; 
            h = w * 0.30;
        } else if( ratio > 5 && ratio <= 6.5) {
            w = v.holder_width * 0.65; 
            h = w * 0.25;
        } else if( ratio > 6.5) {
            w = v.holder_width * 0.60; 
            h = w * 0.20;
        };
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        if( ratio <= 7) {
            w = v.holder_width * 0.70; 
            h = w * 0.15;
        } else if( ratio > 7 && ratio <= 10) {
            w = v.holder_width * 0.65; 
            h = w * 0.12;
        } else if( ratio > 10) {
            w = v.holder_width * 0.60; 
            h = w * 0.10;
        };
    };

    v.arena_prep_list_title = { width: w, height: h };
    v.title = "text_choose_a_spell";

    SYS_UI.create([
        {
            type:"div", 
            id:"arena_prep_list_title", 
            attach:div_holder,
            style:{
                width: v.arena_prep_list_title.width.toString() + "px",
                height: v.arena_prep_list_title.height.toString() + "px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage(v.title) })`,
                backgroundSize: v.arena_prep_list_title.width.toString() + "px" + " " +  v.arena_prep_list_title.height.toString() + "px"
            }
        },
    ]);
};

function createControls(div_holder)
{
    var v = {}; var w = 0; var h = 0;

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);
    
    var ratio = v.holder_width / v.holder_height;

    if(SYS_Data.game.orientation === "portrait")
    {   
        if( ratio <= 5) {
            w = v.holder_width * 0.35; 
            h = w * 0.50;
        } else if( ratio > 5 && ratio <= 6.5) {
            w = v.holder_width * 0.30; 
            h = w * 0.45;
        } else if( ratio > 6.5) {
            w = v.holder_width * 0.25; 
            h = w * 0.40;
        };
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        if( ratio <= 7) {
            w = v.holder_width * 0.20; 
            h = w * 0.50;
        } else if( ratio > 7 && ratio <= 10) {
            w = v.holder_width * 0.20; 
            h = w * 0.40;
        } else if( ratio > 10) {
            w = v.holder_width * 0.20; 
            h = w * 0.35;
        };
    };

    v.arena_prep_list_cancel = { width: w * 0.70, height: h };
    v.arena_prep_list_prevnext = { width: w * 0.50, height: h * 0.80 };
    v.arena_prep_list_page_size = Math.sqrt( w * h ) * 0.35;
    
    SYS_UI.create([
        {
            type:"button", 
            id:"arena_prep_list_previous", 
            attach:div_holder,
            style:{
                width: v.arena_prep_list_prevnext.width.toString() + "px",
                height: v.arena_prep_list_prevnext.height.toString() + "px",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("button_previous") })`,
                backgroundSize: "100% 100%"
            },
            attrib:
            { 
                onclick:"ARENA_Prep_List_Spells.updateList('previous');"
            }
        },
        {
            type:"p", 
            id:"arena_prep_list_page", 
            text:"99/99",
            attach:div_holder,
            style:{
                fontSize:v.arena_prep_list_page_size.toString() + "px",
                color:"white",
                margin:"3%"
            },
        },
        {
            type:"button", 
            id:"arena_prep_list_next", 
            attach:div_holder,
            style:{
                width: v.arena_prep_list_prevnext.width.toString() + "px",
                height: v.arena_prep_list_prevnext.height.toString() + "px",
                marginRight:"10%",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("button_next") })`,
                backgroundSize: "100% 100%"
            },
            attrib:
            { 
                onclick:"ARENA_Prep_List_Spells.updateList('next');"
            }
        },
        {
            type:"button", 
            id:"arena_prep_list_cancel", 
            attach:div_holder,
            style:{
                width: v.arena_prep_list_cancel.width.toString() + "px",
                height: v.arena_prep_list_cancel.height.toString() + "px",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("button_cancel") })`,
                backgroundSize: "100% 100%"
            },
            attrib:
            { 
                onclick:"ARENA_Preparation.initialize();"
            }
        },
    ]);
};

function createList(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    var ratio = v.holder_width / v.holder_height; 

    if(SYS_Data.game.orientation === "portrait")
    {  
        if(ratio <= 0.6){ v.column_count = 3; }
        else if(ratio > 0.6 && ratio <= 0.8){ v.column_count = 4; }
        else if(ratio > 0.8){ v.column_count = 6; }
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        v.column_count = 8;
    };

    v.size = (v.holder_width / v.column_count) * 0.95
    v.row_count = Math.floor(v.holder_height / v.size);

    v.list_count = 0;
    v.list_div_size = v.size;
    v.list_image_size = v.size * 0.80;

    list_measurements = v;

    SYS_UI.create([
        {
            type:"table", 
            id:"arena_prep_list_table", 
            attach:div_holder,
        }
    ]);  

    for(var r = 1; r <= v.row_count;r++)
    {
        SYS_UI.create([
            {
                type:"tr", 
                id:"arena_prep_list_table_tr"+r,
                attach:"arena_prep_list_table"
            }
        ]);  
        
        for(var c = 1; c <= v.column_count;c++)
        {
            v.list_count++; 

            SYS_UI.create([
                {
                    type:"td", 
                    id:"arena_prep_list_table_tr"+r+"td"+c,
                    attach:"arena_prep_list_table_tr"+r,
                },
                {
                    type:"div",
                    id: "arena_prep_list_spell_div"+v.list_count,
                    attach:"arena_prep_list_table_tr"+r+"td"+c,
                    style:{
                        display:"flex",
                        flexDirection:"column",
                        justifyContent:"center",
                        alignItems:"center",
                        width:v.list_div_size.toString() + "px",
                        height:v.list_div_size.toString() + "px",
                    }
                },
                {
                    type:"div",
                    id: "arena_prep_list_spell_image"+v.list_count,
                    attach: "arena_prep_list_spell_div"+v.list_count,
                    style:{
                        width:v.list_image_size.toString() + "px",
                        height:v.list_image_size.toString() + "px",
                        backgroundColor:"rgba(0,0,0,0.4)"
                    }
                },
            ]);  
        };
    };

    return v;
};

f.updateList = function(action)
{
    var current_spells = [];
    var current_page = SYS_Data.arena_prep.spell_list_current_page;

    switch(action)
    {   
        case "start":
            var total_count = list_measurements.column_count * list_measurements.row_count;
            var spell_count = -1;
            var list_page = 0;
            list_spells = [];

            DATA_Spells.spell_data.forEach(function(spell)
            {  
                if(spell.id !== "sp00") //Dont include spell_count 0 = "sp00"
                {   
                    spell_count++;
                    list_page = Math.floor(spell_count / total_count);
                    
                    if(list_spells[list_page] === void 0)
                    {  
                        list_spells.push([]);
                        list_spells[list_page].push(spell);
                    }
                    else
                    {
                        list_spells[list_page].push(spell);
                    };
                    
                };
            });

        break;

        case "previous":
            current_page--;  

            if(current_page < 0)
            {
                current_page = list_spells.length - 1;
            };
        break;

        case "next":
            current_page++;

            if(current_page > list_spells.length - 1)
            {
                current_page = 0;  
            };
        break;
    };

    //Update the data with new current page
    SYS_Data.arena_prep.spell_list_current_page = current_page;

    current_spells = list_spells[current_page];

    document.getElementById("arena_prep_list_page").innerHTML = `${current_page+1}/${list_spells.length}`;

    for(var n = 1; n <= list_measurements.list_count; n++)
    {
        //list_measurements starts with 1 while current_spells
        //starts with 0 so when we use the n in current_spells
        //we need to reduce it by 1

        if(current_spells[n - 1] !== void 0)
        {  
            SYS_UI.style([
                {
                    id: "arena_prep_list_spell_image"+n,
                    background:"transparent",
                    backgroundImage:`url( ${ DATA_Spells.getData(current_spells[n - 1].id,"image") } )`,
                    backgroundSize: "100% 100%"
                },
            ]);  
            SYS_UI.attrib([
                {
                    id: "arena_prep_list_spell_image"+n,
                    onclick:`ARENA_Prep_List_Spells.select('${current_spells[n-1].id}');`
                },
            ]);  
        }
    };
   
};


return f;}());var ARENA_Prep_Loadout_Character = (function(){var f ={};

f.interface = function(div_holder)
{  
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(v.holder_width * 0.80 <= v.holder_height * 0.80)
    {
        v.button_size = v.holder_width * 0.30;
        v.image_size = v.holder_width * 0.80;
        v.margin = v.holder_width * 0.05;
    }
    else if(v.holder_height * 0.80 <= v.holder_width * 0.80)
    {
        v.button_size = v.holder_height * 0.30;
        v.image_size = v.holder_height * 0.80;
        v.margin = v.holder_height * 0.05;
    };

    var character_preview = DATA_UI.getImage(`${SYS_Data.arena_data.user_data.character}_preview`);

    SYS_UI.create([
        {
            type:"button", 
            id:"arena_prep_select_previous", 
            attach:div_holder,
            style:{
                width: v.button_size.toString() + "px",
                height: v.button_size.toString() + "px",
                margin: v.margin.toString() + "px",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("button_previous") })`,
                backgroundSize: "100% 100%"
            },
            attrib:
            { 
                onclick:"ARENA_Prep_Loadout_Character.select('prev')"
            }
        },
        {
            type:"div",
            id: "arena_prep_loadout_character_image",
            attach: div_holder,
            attrib:{
                onclick:"",
                ontouch:""
            },
            style:{
                width:v.image_size.toString() + "px",
                height:v.image_size.toString() + "px",
                background:"transparent",
                backgroundImage:`url( ${ character_preview } )`,
                backgroundSize:"100% 100%"
            }
        },
        {
            type:"button", 
            id:"arena_prep_select_next", 
            attach:div_holder,
            style:{
                width: v.button_size.toString() + "px",
                height: v.button_size.toString() + "px",
                margin: v.margin.toString() + "px",
                marginRight:"10%",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("button_next") })`,
                backgroundSize: "100% 100%"
            },
            attrib:
            { 
                onclick:"ARENA_Prep_Loadout_Character.select('next')"
            }
        },
    ]);  

};

f.select = function(mode)
{
    switch(SYS_Data.arena_data.user_data.character)
    {
        case "character_01":
            if(mode === "prev"){ SYS_Data.arena_data.user_data.character = "character_02"; };
            if(mode === "next"){ SYS_Data.arena_data.user_data.character = "character_02"; };
        break;

        case "character_02":
            if(mode === "prev"){ SYS_Data.arena_data.user_data.character = "character_01"; };
            if(mode === "next"){ SYS_Data.arena_data.user_data.character = "character_01"; };
        break;
    };

    var character_preview = DATA_UI.getImage(`${SYS_Data.arena_data.user_data.character}_preview`);

    SYS_UI.style([
        {
            id: "arena_prep_loadout_character_image",
            backgroundImage:`url( ${ character_preview } )`,
        }
    ]);  
    
};

return f;}());var ARENA_Prep_Loadout_Spells = (function(){var f ={};

f.interface = function(div_holder)
{  
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    //FOR THE TABLE ELEMENT WE NEED TO SWITCH THE ROW AND COLUMN
    v.row_count  = 2;
    v.column_count = 2;

    v.spells_count = 0;
    v.w = (v.holder_width / v.column_count);
    v.h = (v.holder_height / v.row_count);

    if(v.w <= v.h)
    {
        v.temp_size = v.w;
        v.image_size = v.w * 0.80;
    }
    else if(v.h <= v.h)
    {
        v.temp_size = v.h;
        v.image_size = v.h * 0.80;
    };

    createSpells(v,div_holder);

};

function createSpells(v,div_holder)
{
    SYS_UI.create([
        {
            type:"table", 
            id:"arena_prep_loadout_table", 
            attach:div_holder
        }
    ]);  

    for(var r = 1; r <= v.row_count;r++)
    {
        SYS_UI.create([
            {
                type:"tr", 
                id:"arena_prep_loadout_table_tr"+r,
                attach:"arena_prep_loadout_table"
            }
        ]);  
        
        for(var c = 1; c <= v.column_count;c++)
        {
            v.spells_count++; 
            v.spell_id = SYS_Data.arena_data.user_data.spells[v.spells_count];
            v.spell_image = DATA_Spells.getData(v.spell_id,"image");

            SYS_UI.create([
                {
                    type:"td", 
                    id:"arena_prep_loadout_table_tr"+r+"td"+c,
                    attach:"arena_prep_loadout_table_tr"+r,
                },
                {
                    type:"div",
                    id: "arena_prep_loadout_spell_tempdiv"+v.spells_count,
                    attach:"arena_prep_loadout_table_tr"+r+"td"+c,
                    style:{
                        width:v.temp_size.toString() + "px",
                        height:v.temp_size.toString() + "px",
                        display:"flex",
                        flexDirection:"column",
                        justifyContent:"center",
                        alignItems:"center",
                    }
                },
                {
                    type:"div",
                    id: "arena_prep_loadout_spell_image"+v.spells_count,
                    attach:"arena_prep_loadout_spell_tempdiv"+v.spells_count,
                    style:{
                        width:v.image_size.toString() + "px",
                        height:v.image_size.toString() + "px",
                        background:"transparent",
                        backgroundRepeat:"no-repeat",
                        backgroundImage:`url( ${ v.spell_image } )`,
                        backgroundSize: "100% 100%"
                    },
                    attrib:{
                        onclick:`ARENA_Prep_List_Spells.initialize(${v.spells_count});`,
                    },
                },
            ]);  
        };
    };
};


return f;}());var ARENA_Prep_Select_Spell = (function(){var f ={};

f.initialize = function()
{
    //Clear the interface first before adding anything
    SYS_UI.clear({id:SYS_UI.body});

    //Create the menu interface
    createLayout(SYS_UI.body);

    createInfo("arena_prep_select_layer0");
    createControls("arena_prep_select_layer1");

};

f.select = function()
{
    var user = SYS_Data.arena_data.user_data;

    if(user.spells.indexOf(SYS_Data.arena_prep.selected_spell_id) < 0)
    {
        user.spells[SYS_Data.arena_prep.player_spell_index] = SYS_Data.arena_prep.selected_spell_id;
    }
    else
    {
        user.spells[user.spells.indexOf(SYS_Data.arena_prep.selected_spell_id)] = "sp00";
        user.spells[SYS_Data.arena_prep.player_spell_index] = SYS_Data.arena_prep.selected_spell_id;
    };

    ARENA_Preparation.initialize();
};

f.cancel = function()
{
    ARENA_Prep_List_Spells.initialize();
};

function createLayout(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    v.arena_prep_select_layer0 = { width: v.holder_width, height: v.holder_height * 0.80 };
    v.arena_prep_select_layer1 = { width: v.holder_width, height: v.holder_height * 0.20 };

    SYS_UI.create([
        {
            type:"div", 
            id:"arena_prep_select_div_main", 
            attach:div_holder,
            style:{
                width: v.holder_width.toString() + "px",
                height: v.holder_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("game_background") })`,
                backgroundSize: "100% 100%"
            }
        },
        {
            type:"div", 
            id:"arena_prep_select_layer0", 
            attach:"arena_prep_select_div_main",
            style:{
                width: v.arena_prep_select_layer0.width.toString() + "px",
                height: v.arena_prep_select_layer0.height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
            }
        },
        {
            type:"div", 
            id:"arena_prep_select_layer1", 
            attach:"arena_prep_select_div_main",
            style:{
                width: v.arena_prep_select_layer1.width.toString() + "px",
                height: v.arena_prep_select_layer1.height.toString() + "px",
                display:"flex",
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
            }
        },
    ]);
};

function createInfo(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(SYS_Data.game.orientation === "portrait")
    {   
        SYS_UI.style([
            {
                id:div_holder,
                flexDirection:"column",
            }
        ]);

        v.temp_width = v.holder_width;
        v.temp_height = v.holder_height / 2;
    
    } 
    else if(SYS_Data.game.orientation === "landscape")
    {   
        SYS_UI.style([
            {
                id:div_holder,
                flexDirection:"row",
            }
        ]);

        v.temp_width = v.holder_width / 2;
        v.temp_height = v.holder_height;
    
    };

    if(v.temp_width <= v.temp_height)
    {
        v.info_size = v.temp_width * 0.95;
        v.info_margin = v.temp_width * 0.05;
    }
    else if(v.temp_height <= v.temp_width)
    {
        v.info_size = v.temp_height * 0.95;
        v.info_margin = v.temp_height * 0.05;
    };

    SYS_UI.create([
        {
            type:"div", 
            id:"arena_prep_select_info_top", 
            attach:div_holder,
            style:{
                width: v.info_size.toString() + "px",
                height: v.info_size.toString() + "px",
                margin: v.info_margin.toString() + "px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("game_background") })`,
                backgroundSize: "100% 100%"
            }
        },
        {
            type:"div", 
            id:"arena_prep_select_info_bottom", 
            attach:div_holder,
            style:{
                width: v.info_size.toString() + "px",
                height: v.info_size.toString() + "px",
                margin: v.info_margin.toString() + "px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("game_background") })`,
                backgroundSize: "100% 100%"
            }
        },
    ]);

};

function createControls(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(SYS_Data.game.orientation === "portrait")
    {   
        v.button_w = v.holder_width * 0.40; 
        v.button_h = v.button_w * 0.40;
        v.button_m = v.button_w * 0.10;
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        v.button_w = v.holder_width * 0.20; 
        v.button_h = v.button_w * 0.40;
        v.button_m = v.button_w * 0.10;
    };
    
    SYS_UI.create([
        {
            type:"button", 
            id:"arena_prep_select_button_select", 
            attach:div_holder,
            style:{
                width: v.button_w.toString() + "px",
                height: v.button_h.toString() + "px",
                margin: v.button_m.toString() + "px",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("button_select") } )`,
                backgroundSize: "100% 100%"
            },
            attrib:
            { 
                onclick:"ARENA_Prep_Select_Spell.select();"
            }
        },
        {
            type:"button", 
            id:"arena_prep_select_button_cancel", 
            attach:div_holder,
            style:{
                width: v.button_w.toString() + "px",
                height: v.button_h.toString() + "px",
                margin: v.button_m.toString() + "px",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("button_cancel") } )`,
                backgroundSize: "100% 100%"
            },
            attrib:
            { 
                onclick:"ARENA_Prep_Select_Spell.cancel();"
            }
        },
    ]);
};



return f;}());var ARENA_Renderer = (function(){var f ={};

f.render_environment = function(div_holder,battledata)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    var userdata = SYS_Data.arena_data.user_data;

    if(userdata.id === battledata.player1.id)
    { var env = battledata.player1.environment; }
    else if(userdata.id === battledata.player2.id)
    { var env = battledata.player2.environment; }

    //Draw the image
    SYS_UI.style([
        {
            id: div_holder,
            background:"transparent",
            background:`url( ././media/sprites/environment/${env.name}/environment_${env.name}_${env.tag}.png )`,
            backgroundSize:  v.holder_width.toString() + "px" + " " +  v.holder_height.toString() + "px",
        }
    ]);  
};


f.render_entity = function(entity_class,entity)
{   
    if(typeof(entity.model) !== "undefined" && typeof(entity.physics) !== "undefined")
    {
        var sprite = entity.model.sprite;
        var animation = entity.model.animation;
        var size =  entity.model.size;
        var position = entity.physics.position;

        if(entity_class === "characters")
        { 
            var sprite_link = `././media/sprites/${entity_class}/${sprite}/${animation.name}/${sprite}_${animation.tag}_${animation.name}_${animation.frame_count}.png`
        }
        else if(entity_class === "sfx")
        { 
            var sprite_link = `././media/sprites/${entity_class}/${sprite}/sfx_${sprite}_${animation.tag}_${animation.name}_${animation.frame_count}.png`
        }
    
        //Draw the image
        //tile_contents = first array = row/y axis , second array = column/x axis
        var target_tile_content = ARENA_Module_Battleground.tile_contents[position.y][position.x];

        for(var i = 0; i <= target_tile_content.length - 1;i++)
        {
            if(target_tile_content[i] === false)
            {
                SYS_UI.style([
                    {
                        id: "arena_battleground_entity_"+position.x+"_"+position.y+"_"+i,
                        width:"100%",
                        height:"100%",
                        background:"transparent",
                        backgroundRepeat:"no-repeat",
                        backgroundImage:`url( ${ sprite_link } )`,
                        backgroundSize:`${size.w}% ${size.h}%`,
                        backgroundPosition:"center",
                    }
                ]);  

                ARENA_Module_Battleground.tile_contents[position.y][position.x][i] = true;

                break;
            };
        };

    };
}; 

f.render_clear = function()
{
    for(var r = 0; r <= 2;r++)
    {
        for(var c = 0; c <= 3;c++)
        {
            for(var i = 0; i <= 10;i++)
            {
                SYS_UI.style([
                    {
                        id: "arena_battleground_entity_"+c+"_"+r+"_"+i,
                        width:"0%",
                        height:"0%"
                    }
                ]); 

                ARENA_Module_Battleground.tile_contents[r][c][i] = false;
            };
        };
    };

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
                backgroundImage:`url( ${ DATA_UI.getImage(combat_result) })`
            }
        ])
    
    }
    else if(typeof(result_data) === "string")
    {
        SYS_UI.style([
            {
                id:"result_image",
                backgroundImage:`url( ${ DATA_UI.getImage("text_error_occured") })`
            }
        ])
    };

};

f.continue = function()
{
    ARENA_OFFLINE.reset_data();
    ARENA_ONLINE.reset_data();

    ARENA_Preparation.initialize();
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
                backgroundImage:`url( ${ DATA_UI.getImage("game_background") })`,
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
                backgroundImage:`url( ${ DATA_UI.getImage("default_image") })`,
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
                backgroundImage:`url( ${ DATA_UI.getImage("button_continue") })`,
                backgroundSize:  v.button_width.toString() + "px" + " " +  v.button_height.toString() + "px"
            },
            attrib:
            { 
                onclick:"ARENA_Result.continue();"
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

return f;}());var ARENA_WindowInfo_Options = (function(){var f ={};

f.initialize = function()
{   
    //If OFFLINE then pause the Server
    ARENA_OFFLINE.pause_unpause("pause");

    //Lets prevent ARENA_OFFLINE or ARENA_ONLINE 
    //in activating the ARENA_Core interface
    SYS_Data.game.arena_windowinfo_visible = true;

    //Clear the interface first before adding anything
    SYS_UI.clear({id:SYS_UI.body});

    //Create the menu interface
    createLayout(SYS_UI.body);

    createControls("arena_windowinfo_options_layer1");

};

f.close = function()
{
    //If ONLINE then unpause the Server
    ARENA_OFFLINE.pause_unpause("unpause");

    //Lets allow again the ARENA_OFFLINE or ARENA_ONLINE 
    //in activating the ARENA_Core interface
    SYS_Data.game.arena_windowinfo_visible = false;

    ARENA_Core.initializeInterface();
};

function createLayout(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    v.arena_windowinfo_options_layer0 = { width: v.holder_width, height: v.holder_height * 0.80 };
    v.arena_windowinfo_options_layer1 = { width: v.holder_width, height: v.holder_height * 0.20 };

    SYS_UI.create([
        {
            type:"div", 
            id:"arena_windowinfo_options_div_main", 
            attach:div_holder,
            style:{
                width: v.holder_width.toString() + "px",
                height: v.holder_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("game_background") })`,
                backgroundSize: "100% 100%"
            }
        },
        {
            type:"div", 
            id:"arena_windowinfo_options_layer0", 
            attach:"arena_windowinfo_options_div_main",
            style:{
                width: v.arena_windowinfo_options_layer0.width.toString() + "px",
                height: v.arena_windowinfo_options_layer0.height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
            }
        },
        {
            type:"div", 
            id:"arena_windowinfo_options_layer1", 
            attach:"arena_windowinfo_options_div_main",
            style:{
                width: v.arena_windowinfo_options_layer1.width.toString() + "px",
                height: v.arena_windowinfo_options_layer1.height.toString() + "px",
                display:"flex",
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
            }
        },
    ]);
};

function createControls(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(SYS_Data.game.orientation === "portrait")
    {   
        v.button_w = v.holder_width * 0.40; 
        v.button_h = v.button_w * 0.40;
        v.button_m = v.button_w * 0.10;
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        v.button_w = v.holder_width * 0.20; 
        v.button_h = v.button_w * 0.40;
        v.button_m = v.button_w * 0.10;
    };
    
    SYS_UI.create([
        {
            type:"button", 
            id:"arena_windowinfo_options_button_close", 
            attach:div_holder,
            style:{
                width: v.button_w.toString() + "px",
                height: v.button_h.toString() + "px",
                margin: v.button_m.toString() + "px",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("button_close") } )`,
                backgroundSize: "100% 100%"
            },
            attrib:
            { 
                onclick:"ARENA_WindowInfo_Options.close();"
            }
        },
    ]);
};



return f;}());var ARENA_WindowInfo_Spell = (function(){var f ={};

f.initialize = function()
{   
    //If OFFLINE then pause the Server
    ARENA_OFFLINE.pause_unpause("pause");

    //Lets prevent ARENA_OFFLINE or ARENA_ONLINE 
    //in activating the ARENA_Core interface
    SYS_Data.game.arena_windowinfo_visible = true;

    //Clear the interface first before adding anything
    SYS_UI.clear({id:SYS_UI.body});

    //Create the menu interface
    createLayout(SYS_UI.body);

    createInfo("arena_windowinfo_spell_layer0");
    createControls("arena_windowinfo_spell_layer1");

};

f.close = function()
{
    //If ONLINE then unpause the Server
    ARENA_OFFLINE.pause_unpause("unpause");

    //Lets allow again the ARENA_OFFLINE or ARENA_ONLINE 
    //in activating the ARENA_Core interface
    SYS_Data.game.arena_windowinfo_visible = false;

    ARENA_Core.initializeInterface();
};

function createLayout(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    v.arena_windowinfo_spell_layer0 = { width: v.holder_width, height: v.holder_height * 0.80 };
    v.arena_windowinfo_spell_layer1 = { width: v.holder_width, height: v.holder_height * 0.20 };

    SYS_UI.create([
        {
            type:"div", 
            id:"arena_windowinfo_spell_div_main", 
            attach:div_holder,
            style:{
                width: v.holder_width.toString() + "px",
                height: v.holder_height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("game_background") })`,
                backgroundSize: "100% 100%"
            }
        },
        {
            type:"div", 
            id:"arena_windowinfo_spell_layer0", 
            attach:"arena_windowinfo_spell_div_main",
            style:{
                width: v.arena_windowinfo_spell_layer0.width.toString() + "px",
                height: v.arena_windowinfo_spell_layer0.height.toString() + "px",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
            }
        },
        {
            type:"div", 
            id:"arena_windowinfo_spell_layer1", 
            attach:"arena_windowinfo_spell_div_main",
            style:{
                width: v.arena_windowinfo_spell_layer1.width.toString() + "px",
                height: v.arena_windowinfo_spell_layer1.height.toString() + "px",
                display:"flex",
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
            }
        },
    ]);
};

function createInfo(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(SYS_Data.game.orientation === "portrait")
    {   
        SYS_UI.style([
            {
                id:div_holder,
                flexDirection:"column",
            }
        ]);

        v.temp_width = v.holder_width;
        v.temp_height = v.holder_height / 2;
    
    } 
    else if(SYS_Data.game.orientation === "landscape")
    {   
        SYS_UI.style([
            {
                id:div_holder,
                flexDirection:"row",
            }
        ]);

        v.temp_width = v.holder_width / 2;
        v.temp_height = v.holder_height;
    
    };

    if(v.temp_width <= v.temp_height)
    {
        v.info_size = v.temp_width * 0.95;
        v.info_margin = v.temp_width * 0.05;
    }
    else if(v.temp_height <= v.temp_width)
    {
        v.info_size = v.temp_height * 0.95;
        v.info_margin = v.temp_height * 0.05;
    };

    SYS_UI.create([
        {
            type:"div", 
            id:"arena_windowinfo_spell_info_top", 
            attach:div_holder,
            style:{
                width: v.info_size.toString() + "px",
                height: v.info_size.toString() + "px",
                margin: v.info_margin.toString() + "px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("game_background") })`,
                backgroundSize: "100% 100%"
            }
        },
        {
            type:"div", 
            id:"arena_windowinfo_spell_info_bottom", 
            attach:div_holder,
            style:{
                width: v.info_size.toString() + "px",
                height: v.info_size.toString() + "px",
                margin: v.info_margin.toString() + "px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("game_background") })`,
                backgroundSize: "100% 100%"
            }
        },
    ]);

};

function createControls(div_holder)
{
    var v = {};

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    if(SYS_Data.game.orientation === "portrait")
    {   
        v.button_w = v.holder_width * 0.40; 
        v.button_h = v.button_w * 0.40;
        v.button_m = v.button_w * 0.10;
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        v.button_w = v.holder_width * 0.20; 
        v.button_h = v.button_w * 0.40;
        v.button_m = v.button_w * 0.10;
    };
    
    SYS_UI.create([
        {
            type:"button", 
            id:"arena_windowinfo_spell_button_close", 
            attach:div_holder,
            style:{
                width: v.button_w.toString() + "px",
                height: v.button_h.toString() + "px",
                margin: v.button_m.toString() + "px",
                border: "0px",
                background:"transparent",
                backgroundImage:`url( ${ DATA_UI.getImage("button_close") } )`,
                backgroundSize: "100% 100%"
            },
            attrib:
            { 
                onclick:"ARENA_WindowInfo_Spell.close();"
            }
        },
    ]);
};



return f;}());var CLIENT_GATE = (function(){var f ={};

/*
    !!!============REMEMBER========!!!
    The CLIENT GATE and SERVER GATE are used
    to communicate between the client and the
    server offline. Because the offline server
    is inside the Web Worker
*/

var worker;

f.initialize = function()
{
    worker = new Worker("app/server.js");

    worker.addEventListener("message",function(message)
    {
        recieve(message);
    })
};

f.send = function(message)
{
    worker.postMessage(message);
};

function recieve(message)
{   
    switch(message.data.title)
    {
        case "connect":
            SYS_Data.offline_arena.server_message = message.data.content;
        break;

        case "localstorage_get":
            SYS_LocalStorage.offline_server_data = message.data.content;
        break;
    };
};

return f;}());var DATA_Image = (function(){var f ={};

f.preload = function()
{
    for(var i = 0; i <= f.links.length - 1;i++)
    {
        new Image().src = f.links[i].link;
    };
};

f.links = 
[
    {  name:"game_background", link:"././media/images/ui/game_background.jpg"   },
    {  name:"button_arena", link:"././media/images/ui/button_arena.png"  },
    {  name:"button_online", link:"././media/images/ui/button_online.png"  },
    {  name:"button_offline", link:"././media/images/ui/button_offline.png" },
    {  name:"button_cancel", link:"././media/images/ui/button_cancel.png" },
    {  name:"button_close", link:"././media/images/ui/button_close.png" },
    {  name:"button_continue", link:"././media/images/ui/button_continue.png" },
    {  name:"button_back", link:"././media/images/ui/button_back.png" },
    {  name:"button_settings", link:"././media/images/ui/button_settings.png" },
    {  name:"button_edit", link:"././media/images/ui/button_edit.png" },
    {  name:"button_select", link:"././media/images/ui/button_select.png" },
    {  name:"button_previous", link:"././media/images/ui/button_previous.png" },
    {  name:"button_next", link:"././media/images/ui/button_next.png" },
    {  name:"button_move_up", link:"././media/images/ui/button_move_up.png" },
    {  name:"button_move_down", link:"././media/images/ui/button_move_down.png" },
    {  name:"text_choose_a_spell", link:"././media/images/ui/text_choose_a_spell.png" },
    {  name:"text_battle_loadout", link:"././media/images/ui/text_battle_loadout.png" },
    {  name:"text_connecting", link:"././media/images/ui/text_connecting.png" },
    {  name:"text_connection_failed", link:"././media/images/ui/text_connection_failed.png" },
    {  name:"text_error_occured", link:"././media/images/ui/text_error_occured.png" },
    {  name:"text_victory", link:"././media/images/ui/text_victory.png" },
    {  name:"text_defeat", link:"././media/images/ui/text_defeat.png" },
    {  name:"text_draw", link:"././media/images/ui/text_draw.png" },
    {  name:"default", link:"././media/images/others/default_icon.png" },

    {  name:"character_01_preview", link:"././media/sprites/characters/character_01/idle/character_01_left_idle_0.png" },
    {  name:"character_02_preview", link:"././media/sprites/characters/character_02/idle/character_02_left_idle_0.png" },

    {  link:"././media/sprites/characters/character_01/attack/character_01_left_attack_0.png" },
    {  link:"././media/sprites/characters/character_01/attack/character_01_left_attack_1.png" },
    {  link:"././media/sprites/characters/character_01/attack/character_01_left_attack_2.png" },
    {  link:"././media/sprites/characters/character_01/attack/character_01_right_attack_0.png" },
    {  link:"././media/sprites/characters/character_01/attack/character_01_right_attack_1.png" },
    {  link:"././media/sprites/characters/character_01/attack/character_01_right_attack_2.png" },
    {  link:"././media/sprites/characters/character_01/idle/character_01_left_idle_0.png" },
    {  link:"././media/sprites/characters/character_01/idle/character_01_right_idle_0.png" },

    {  link:"././media/sprites/characters/character_02/attack/character_02_left_attack_0.png" },
    {  link:"././media/sprites/characters/character_02/attack/character_02_left_attack_1.png" },
    {  link:"././media/sprites/characters/character_02/attack/character_02_left_attack_2.png" },
    {  link:"././media/sprites/characters/character_02/attack/character_02_left_attack_3.png" },
    {  link:"././media/sprites/characters/character_02/attack/character_02_right_attack_0.png" },
    {  link:"././media/sprites/characters/character_02/attack/character_02_right_attack_1.png" },
    {  link:"././media/sprites/characters/character_02/attack/character_02_right_attack_2.png" },
    {  link:"././media/sprites/characters/character_02/attack/character_02_right_attack_3.png" },
    {  link:"././media/sprites/characters/character_02/idle/character_02_left_idle_0.png" },
    {  link:"././media/sprites/characters/character_02/idle/character_02_right_idle_0.png" },

    {  link:"././media/sprites/environment/default/environment_default_both.png" },

    {  link:"././media/sprites/sfx/energy_ball/sfx_energy_ball_both_idle_0.png" },
    
    {  link:"././media/sprites/sfx/explode_fire/sfx_explode_fire_both_idle_0.png" },
    {  link:"././media/sprites/sfx/explode_fire/sfx_explode_fire_both_idle_1.png" },
    {  link:"././media/sprites/sfx/explode_fire/sfx_explode_fire_both_idle_2.png" },
    {  link:"././media/sprites/sfx/explode_fire/sfx_explode_fire_both_idle_3.png" },
    {  link:"././media/sprites/sfx/explode_fire/sfx_explode_fire_both_idle_4.png" },
    {  link:"././media/sprites/sfx/explode_fire/sfx_explode_fire_both_idle_5.png" },
    {  link:"././media/sprites/sfx/explode_fire/sfx_explode_fire_both_idle_6.png" },
    {  link:"././media/sprites/sfx/explode_fire/sfx_explode_fire_both_idle_7.png" },

    {  link:"././media/sprites/sfx/fire_beam/sfx_fire_beam_left_idle_0.png" },
    {  link:"././media/sprites/sfx/fire_beam/sfx_fire_beam_left_idle_1.png" },
    {  link:"././media/sprites/sfx/fire_beam/sfx_fire_beam_left_idle_2.png" },
    {  link:"././media/sprites/sfx/fire_beam/sfx_fire_beam_left_idle_3.png" },

    {  link:"././media/sprites/sfx/fire_beam/sfx_fire_beam_right_idle_0.png" },
    {  link:"././media/sprites/sfx/fire_beam/sfx_fire_beam_right_idle_1.png" },
    {  link:"././media/sprites/sfx/fire_beam/sfx_fire_beam_right_idle_2.png" },
    {  link:"././media/sprites/sfx/fire_beam/sfx_fire_beam_right_idle_3.png" },

    {  link:"././media/sprites/sfx/rain_of_fire/sfx_rain_of_fire_left_idle_0.png" },
    {  link:"././media/sprites/sfx/rain_of_fire/sfx_rain_of_fire_right_idle_0.png" },

    {  link:"././media/sprites/sfx/recharge/sfx_recharge_both_idle_0.png" },
    {  link:"././media/sprites/sfx/recharge/sfx_recharge_both_idle_1.png" },
    {  link:"././media/sprites/sfx/recharge/sfx_recharge_both_idle_2.png" },
    {  link:"././media/sprites/sfx/recharge/sfx_recharge_both_idle_3.png" },

    {  link:"././media/sprites/sfx/replenish/sfx_replenish_both_idle_0.png" },
    {  link:"././media/sprites/sfx/replenish/sfx_replenish_both_idle_1.png" },
    {  link:"././media/sprites/sfx/replenish/sfx_replenish_both_idle_2.png" },
    {  link:"././media/sprites/sfx/replenish/sfx_replenish_both_idle_3.png" },

    {  link:"././media/sprites/sfx/root/sfx_root_both_idle_0.png" },
    {  link:"././media/sprites/sfx/root/sfx_root_both_idle_1.png" },
    {  link:"././media/sprites/sfx/root/sfx_root_both_idle_2.png" },

    {  link:"././media/sprites/sfx/shield_blue/sfx_shield_blue_both_idle_0.png" },

]


return f;}());var DATA_Spells = (function(){var f ={};

f.spell_data = 
[
    { id:"sp00", image:"././media/images/others/default_icon.png" },
    { id:"sp01", image:"././media/images/spells/atomic-slashes.png" },
    { id:"sp02", image:"././media/images/spells/abstract-013.png" },
    { id:"sp03", image:"././media/images/spells/laser-precision.png" },
    { id:"sp04", image:"././media/images/spells/heavy-rain.png" },
];

f.getData = function(spell_id,spell_target_data)
{
    for(var i = 0; i <= f.spell_data.length;i++)
    {
        if(f.spell_data[i].id === spell_id)
        {
            return f.spell_data[i][spell_target_data];
        };
    };

};

/*
//FOR DEBUGGING
var count = 0; 
do {
    count++; 
    DATA_Spells.spell_data.push({ id:`spx${count}`, image:"././media/images/spells/heavy-rain.png" }, ); 
}
while(count <= 50);
*/

return f;}());var DATA_UI = (function(){var f ={};

f.getImage = function(name)
{   
    for(var i = 0; i <= DATA_Image.links.length - 1;i++)
    {
        if(DATA_Image.links[i].name === name)
        {
            return DATA_Image.links[i].link
        };
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

    //Show performance panel for debug purposes
    if(SYS_Data.game.show_performance_panel === true)
    {
        var stats = new Stats();
        stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( stats.dom );
        requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});
    };

};

f.controls = function(id)
{
    switch(id)
    {
        case "arena":
            //Dont put the reset data in the
            //ARENA Preparation. For more info
            //please read the note at .reset_data()
            ARENA_OFFLINE.reset_data();
            ARENA_ONLINE.reset_data();

            ARENA_Preparation.initialize();
        break;

        default:
          HOME_Start.initialize();  
        break;
    };
};

function createInterface(div_holder)
{
    var v = {}; var w = 0; var h = 0;

    v.holder_width = parseInt(document.getElementById(div_holder).style.width);
    v.holder_height = parseInt(document.getElementById(div_holder).style.height);

    var ratio = v.holder_width / v.holder_height;
   
    if(SYS_Data.game.orientation === "portrait")
    {   
        if( ratio <= 0.5 ) {
            w = v.holder_width * 0.40; 
            h = w * 0.30;
        } else if( ratio > 0.5 && ratio <= 0.6) {
            w = v.holder_width * 0.40; 
            h = w * 0.25;
        } else if( ratio > 0.6) {
            w = v.holder_width * 0.40; 
            h = w * 0.20;
        };
    }
    else if(SYS_Data.game.orientation === "landscape")
    {
        if( ratio <= 1.5) {
            w = v.holder_width * 0.30; 
            h = w * 0.24;
        } else if( ratio > 1.5 && ratio <= 1.8) {
            w = v.holder_width * 0.25; 
            h = w * 0.22;
        } else if( ratio > 1.8) {
            w = v.holder_width * 0.20; 
            h = w * 0.20;
        };
    };

    v.button_width = w;
    v.button_height = h;

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
                background:`url( ${ DATA_UI.getImage("game_background") } )`,
                backgroundSize:  v.holder_width.toString() + "px" + " " +  v.holder_height.toString() + "px",
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
                backgroundImage:`url( ${ DATA_UI.getImage("button_arena") } )`,
                backgroundSize:  v.button_width.toString() + "px" + " " +  v.button_height.toString() + "px"
            },
            attrib:
            { 
                onclick:"HOME_Start.controls('arena');"
            }
        },
    ]);

};

return f;}());var SYS_Data = (function(){var f ={};

f.game =  
{
     touch_enable:false,
     orientation:"portrait",
     window_width:0,
     window_height:0,
     current_interface:"home_start",
     show_performance_panel:true,
     arena_windowinfo_visible:false,
};

f.localstorage =
{
     enabled:true,
     id:"bduel",
     version:0
};

f.online_arena = {}; //The content is created at ARENA_ONLINE.initialize();

f.offline_arena = {};  //The content is created at ARENA_OFFLINE.initialize();

f.arena_data = 
{
     user_data:
     {
         id:"", //generated at ARENA_OFFLINE and ARENA_ONLINE join action
         name:"Human Player",//updated at ARENA_Prep_Component_Layer1.createInterface()
         character:"character_01",//updated at ARENA_Prep_Loadout_Character.select()
         spells:["sp00","sp01","sp02","sp03","sp04"],//sp00 will always be at index 0
     },
     battledata:{},
     controls_data:
     {
          spell_selected:0,
          previous_spell_selected:0,
          position_selected:0,
     },
};

f.arena_prep = 
{
     spell_list_current_page:0,
     player_spell_index:0,
     selected_spell_id:""
};

return f;}());var SYS_Initializer = (function(){var f ={};

f.start = function()
{

    DATA_Image.preload();

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

        case "arena_preparation":
            ARENA_Preparation.initialize();
        break;

        case "arena_result":
            //ARENA_Result.initialize() requires parameters
            //to run. Since we don't have data for the parameters
            //we just manually press the continue button.
            //In order to reset any data and proceed to preparation
            ARENA_Result.continue();
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

//This is where the SERVER_GATE updates the data
f.offline_server_data = {};

f.load = function()
{
    if(SYS_Data.localstorage.enabled === true)
    {
        var data = JSON.parse(window.localStorage.getItem(SYS_Data.localstorage.id));

        if(data !== null)
        {
            if(data.version !== null || typeof(data.version) !== "undefined"){
    
                if(data.version !== SYS_Data.localstorage.version){
                    window.localStorage.removeItem(SYS_Data.localstorage.id);
                }else{
                    //Client data
                    SYS_Data.game = data.client.game;
                    SYS_Data.online = data.client.online;
                    SYS_Data.arena_data = data.client.arena_data;

                    //Server data
                    CLIENT_GATE.send( {title:"localstorage_set", content:data.server } );
                };
    
            }else{
                window.localStorage.removeItem(SYS_Data.localstorage.id);
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
    if(SYS_Data.localstorage.enabled === true)
    {
        CLIENT_GATE.send( { title:"localstorage_get" } );

        //When we use the CLIENT_GATE.send it returns the result from the
        //SERVER_GATE.send. Then the CLIENT GATE recieved the data and
        //immediate update the f.offline_server_data

        var data = 
        {
            version: SYS_Data.localstorage.version,
            client: SYS_Data,
            server:
            {
                battledata_all: f.offline_server_data.battledata_all,
                matchdata_all: f.offline_server_data.matchdata_all
            }
        };

        window.localStorage.setItem(SYS_Data.localstorage.id,JSON.stringify(data));
    }
    else
    {
        window.localStorage.clear();
    };

};


return f;}());(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Stats = factory());
}(this, (function () { 'use strict';

/**
 * @author mrdoob / http://mrdoob.com/
 */

var Stats = function () {

	var mode = 0;

	var container = document.createElement( 'div' );
	container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
	container.addEventListener( 'click', function ( event ) {

		event.preventDefault();
		showPanel( ++ mode % container.children.length );

	}, false );

	//

	function addPanel( panel ) {

		container.appendChild( panel.dom );
		return panel;

	}

	function showPanel( id ) {

		for ( var i = 0; i < container.children.length; i ++ ) {

			container.children[ i ].style.display = i === id ? 'block' : 'none';

		}

		mode = id;

	}

	//

	var beginTime = ( performance || Date ).now(), prevTime = beginTime, frames = 0;

	var fpsPanel = addPanel( new Stats.Panel( 'FPS', '#0ff', '#002' ) );
	var msPanel = addPanel( new Stats.Panel( 'MS', '#0f0', '#020' ) );

	if ( self.performance && self.performance.memory ) {

		var memPanel = addPanel( new Stats.Panel( 'MB', '#f08', '#201' ) );

	}

	showPanel( 0 );

	return {

		REVISION: 16,

		dom: container,

		addPanel: addPanel,
		showPanel: showPanel,

		begin: function () {

			beginTime = ( performance || Date ).now();

		},

		end: function () {

			frames ++;

			var time = ( performance || Date ).now();

			msPanel.update( time - beginTime, 200 );

			if ( time >= prevTime + 1000 ) {

				fpsPanel.update( ( frames * 1000 ) / ( time - prevTime ), 100 );

				prevTime = time;
				frames = 0;

				if ( memPanel ) {

					var memory = performance.memory;
					memPanel.update( memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576 );

				}

			}

			return time;

		},

		update: function () {

			beginTime = this.end();

		},

		// Backwards Compatibility

		domElement: container,
		setMode: showPanel

	};

};

Stats.Panel = function ( name, fg, bg ) {

	var min = Infinity, max = 0, round = Math.round;
	var PR = round( window.devicePixelRatio || 1 );

	var WIDTH = 80 * PR, HEIGHT = 48 * PR,
			TEXT_X = 3 * PR, TEXT_Y = 2 * PR,
			GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
			GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;

	var canvas = document.createElement( 'canvas' );
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.cssText = 'width:80px;height:48px';

	var context = canvas.getContext( '2d' );
	context.font = 'bold ' + ( 9 * PR ) + 'px Helvetica,Arial,sans-serif';
	context.textBaseline = 'top';

	context.fillStyle = bg;
	context.fillRect( 0, 0, WIDTH, HEIGHT );

	context.fillStyle = fg;
	context.fillText( name, TEXT_X, TEXT_Y );
	context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

	context.fillStyle = bg;
	context.globalAlpha = 0.9;
	context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

	return {

		dom: canvas,

		update: function ( value, maxValue ) {

			min = Math.min( min, value );
			max = Math.max( max, value );

			context.fillStyle = bg;
			context.globalAlpha = 1;
			context.fillRect( 0, 0, WIDTH, GRAPH_Y );
			context.fillStyle = fg;
			context.fillText( round( value ) + ' ' + name + ' (' + round( min ) + '-' + round( max ) + ')', TEXT_X, TEXT_Y );

			context.drawImage( canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT );

			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT );

			context.fillStyle = bg;
			context.globalAlpha = 0.9;
			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round( ( 1 - ( value / maxValue ) ) * GRAPH_HEIGHT ) );

		}

	};

};

return Stats;

})));
var SYS_UI = (function(){var f = {};

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

    //All WindowInfo will be closed
    SYS_Data.game.arena_windowinfo_visible = false;

    //Connect to offline server
    offlineConnection()

};

f.reset_data = function()
{
    //========== REMEMBER ================//
    // Resetting data can cause a bug if not handled carefully
    //The bug usually occurs when localStorageData is enabled
    //because when we reset the data at ARENA_OFFLINE/ARENA_ONLINE
    //the saved data from localStorage will not be applied so
    //a new battle occur when the browser window is refreshed.
    //to prevent this we only allow resetting the data at the following
    //events
    // 1.) When we open ARENA at HOME_Interface
    // 2.) When we press CONTINUE at ARENA Result
    //Because those functions don't reset the current battledata
    //and userdata when the window is refreshed
    //*Please read SYS_Interface startCurrentGameInterface
    //=====================================//
    
    //Set first the offline arena data
    //Dont set it on SYS_Data to prevent previous
    //values from previous sessions in causing bugs
    SYS_Data.offline_arena =
    {
         server:function(){},
         server_message:"",
         server_timer:setInterval,
    };

    //Clear Data except the user data
    SYS_Data.arena_data.connection = "",
    SYS_Data.arena_data.battledata = {},
    SYS_Data.arena_data.controls_data = { spell_selected:0, position_selected:0 };
    
    //Generate new id
    SYS_Data.arena_data.user_data.id = SYS_Utils.idGenerator(20);
};

f.pause_unpause = function(mode)
{
    var battledata = SYS_Data.arena_data.battledata;

    switch(mode)
    {
        case "pause":
            if(battledata.core.status === "ongoing")
            {
                server_input = 
                {
                    title:"pause", body:{ player_id:SYS_Data.arena_data.user_data.id }
                };
                CLIENT_GATE.send( {title:"offline", content:JSON.stringify(server_input) } );
            };
        break;

        case "unpause":
            if(battledata.core.status === "pause")
            {
                server_input = 
                {
                    title:"unpause", body: { player_id:SYS_Data.arena_data.user_data.id }
                };
                CLIENT_GATE.send( {title:"offline", content:JSON.stringify(server_input) } );
            };
        break;
    };
};
//=========================================================================

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
        CLIENT_GATE.send( {title:"connect", content:JSON.stringify(server_input) } );
       
        //Now get the server_message from the CLIENT.recieve
        try
        {
            offline.server_message = JSON.parse(offline.server_message);
        }
        catch(e)
        {
            offline.server_message = {title:"", body:{}};
        };
        
        
        //Get the check result
        //0 = player not yet joined
        if(offline.server_message.title === "check_result" && offline.server_message.body.result === 0)
        {    
            //The human player will join the battle
            server_input = getServerInput("join");
            CLIENT_GATE.send( {title:"connect", content:JSON.stringify(server_input) } );

            //Prepare the AI
            AI_ARENA_Core.createAI();

            //The AI player will join the battle
            server_input = AI_ARENA_Core.getServerInput("join");
            CLIENT_GATE.send( {title:"connect", content:JSON.stringify(server_input) } );

        }
        else if(offline.server_message.title === "check_result" && offline.server_message.body.result === 1)
        {
            SYS_Data.arena_data.battledata = offline.server_message.body.battledata;
            
            //Lets detect if the ARENA_Core.initialized() has
            //already been started so that it can only run once
            try{ document.getElementById("arena_battleground_layout_div").innerHTML; }catch(e)
            {
                if(SYS_Data.game.arena_windowinfo_visible === false)
                {
                    ARENA_Core.initializeInterface();
                };
            };

            //Update the ARENA
            try
            { 
                //Use gameover than battleover to ensure the arena will not
                //immediately cut off without showing the last actions leading
                //to winning or losing
                if(SYS_Data.arena_data.battledata.core.status === "gameover")
                {
                    ARENA_Result.initialize(SYS_Data.arena_data.battledata,SYS_Data.arena_data.user_data);
                    
                    if(SYS_Data.game.current_interface === "arena_result")
                    {
                        //Only stop the server_interval if the arena result showed
                        //up. Because if you change tab or change window the arena
                        //result will not show up if it is interrupted at the 
                        //transition part.
                        clearInterval(offline.server_interval);
                    };
                }
                else
                { 
                    ARENA_Core.updateInterface();

                    server_input = getServerInput("update");
                    CLIENT_GATE.send( {title:"connect", content:JSON.stringify(server_input) } );

                    server_input = AI_ARENA_Core.getServerInput("update");
                    CLIENT_GATE.send( {title:"connect", content:JSON.stringify(server_input) } );
                };
            }catch(error)
            {
                //If there something return in the returned battledata
                //then proceed to RESULT INTERFACE
                console.log(error.message);
                ARENA_Result.initialize(error.message);

                if(SYS_Data.game.current_interface === "arena_result")
                {
                    //Only stop the server_interval if the arena result showed
                    //up. Because if you change tab or change window the arena
                    //result will not show up if it is interrupted at the 
                    //transition part.
                    clearInterval(offline.server_interval);
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
                backgroundImage:`url( ${ DATA_UI.getImage("game_background") })`,
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
                backgroundImage:`url( ${ DATA_UI.getImage("text_connecting") })`,
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

    //All WindowInfo will be closed
    SYS_Data.game.arena_windowinfo_visible = false;

    //Connect to the server
    onlineConnection();

};

f.reset_data = function()
{
    //========== REMEMBER ================//
    // Resetting data can cause a bug if not handled carefully
    //The bug usually occurs when localStorageData is enabled
    //because when we reset the data at ARENA_OFFLINE/ARENA_ONLINE
    //the saved data from localStorage will not be applied so
    //a new battle occur when the browser window is refreshed.
    //to prevent this we only allow resetting the data at the following
    //events
    // 1.) When we open ARENA at HOME_Interface
    // 2.) When we press CONTINUE at ARENA Result
    //Because those functions don't reset the current battledata
    //and userdata when the window is refreshed
    //*Please read SYS_Interface startCurrentGameInterface
    //=====================================//

    //Set first the online arena data
    //Dont set it on SYS_Data to prevent previous
    //values from previous sessions in causing bugs
    SYS_Data.online_arena =
    {
         debug:true,
         debug_server_url:'ws://localhost:3000/',
         production_server_url:"wss://mduel.herokuapp.com/",
         server:WebSocket,
         server_message:"",
         server_timer:setInterval,
    };

    //Clear Data except the user data
    SYS_Data.arena_data.connection = "",
    SYS_Data.arena_data.battledata = {},
    SYS_Data.arena_data.controls_data = { spell_selected:0, position_selected:0 };
    
    //Generate new id
    SYS_Data.arena_data.user_data.id = SYS_Utils.idGenerator(20);

};

f.cancel = function()
{
    clearInterval(SYS_Data.online_arena.server_interval);
    SYS_Data.online_arena.server.close();
    ARENA_Preparation.initialize();
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
                    //Join match
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
                        //already been started so that it can only run once
                        try{ document.getElementById("arena_battleground_layout_div").innerHTML; }catch(e)
                        {
                            if(SYS_Data.game.arena_windowinfo_visible === false)
                            {
                                ARENA_Core.initializeInterface();
                            };
                        };

                        //Update the ARENA
                        try
                        { 
                            //Use gameover than battleover to ensure the arena will not
                            //immediately cut off without showing the last actions leading
                            //to winning or losing
                           if(SYS_Data.arena_data.battledata.core.status === "gameover")
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
    
        },20);
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
        if(SYS_Data.game.current_interface === "arena_online")
        {
            clearInterval(online.server_interval);
            ARENA_ONLINE_ErrorConnection.initialize();
        };
    });

    //Get close
    online.server.addEventListener('close', function(event)
    {
        if(SYS_Data.game.current_interface === "arena_online")
        {
            clearInterval(online.server_interval);
            ARENA_ONLINE_ErrorConnection.initialize();
        };
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
                backgroundImage:`url( ${ DATA_UI.getImage("game_background") })`,
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
                backgroundImage:`url( ${ DATA_UI.getImage("text_connecting") })`,
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
                backgroundImage:`url( ${ DATA_UI.getImage("button_cancel") })`,
                backgroundSize:  v.button_width.toString() + "px" + " " +  v.button_height.toString() + "px"
            },
            attrib:
            { 
                onclick:"ARENA_ONLINE.cancel();"
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
    ARENA_Prep_Layout.initialize(SYS_UI.body);

    //Create components
    ARENA_Prep_Component_Layer0.initialize("arena_prep_div_layer0");
    ARENA_Prep_Component_Layer1.initialize("arena_prep_div_layer1");
    ARENA_Prep_Component_Layer2.initialize("arena_prep_div_layer2");
    ARENA_Prep_Component_Layer3.initialize("arena_prep_div_layer3");

    //Show performance panel for debug purposes
    if(SYS_Data.game.show_performance_panel === true)
    {
        var stats = new Stats();
        stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( stats.dom );
        requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});
    };

};

return f;}());window.onload = function()
{
    var load_check_interval = setInterval(function()
    {
        if(window.innerWidth >= 1 && window.innerHeight >= 1)
        {
           //Initialize Server
           CLIENT_GATE.initialize();
           CLIENT_GATE.send( { title:"initialize" } );

           //Initialize Client
           SYS_Initializer.start();

            clearInterval(load_check_interval);
        };
    },1);

};/*This comment was created to prevent the white square from popping up and causing error.*/ 
