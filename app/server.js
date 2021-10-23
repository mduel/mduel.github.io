var CHARACTER_01 = (function(){var f ={};

const animation_database =
{
    idle: { max_frame:1 , max_speed:10, run_once:false },
    attack: { max_frame:3, max_speed:10, run_once:true }
};

f.environment = function(player)
{
    var data = 
    {
        "player1":{name:"default", tag:"both"},
        "player2":{name:"default", tag:"both"},   
    };

    var new_environment = 
    {
       name:data[player].name,
       tag:data[player].tag
    };

    return new_environment;
};

f.create = function(player_owner)
{
    if(player_owner === "player1")
    {
        var init_animation_tag = "left";
        var init_animation_name = "idle";
        var init_position = {x:0, y:1};
        var init_border_limit = { x:{min:0, max:1}, y:{min:0, max:2} };
    }
    else if(player_owner === "player2")
    {
        var init_animation_tag = "right";
        var init_animation_name = "idle";
        var init_position = {x:3, y:1};
        var init_border_limit = { x:{min:2, max:3}, y:{min:0, max:2} };
    };

    var new_character = 
    {
        info:
        {
            id:ENGINE_Utils.idGenerator(20),
            name: "character_01",
            class: "character",
            subclass: "character",  //used for collision targeting
            owner:player_owner,
            //When it has an expiration it means it will be destroyed
            //before the current phase will end.
            has_expiration:false,
        },
        model:
        {
            sprite: "character_01",
            size:{  w:70, h:70 }, //min 0 max 100
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
            can_move:false,
            border_limit: init_border_limit,
            has_border_limit: true,
            has_reached_border_limit:false,
        }
    };

    return new_character;
};

f.update = function(action,entity)
{   
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

return f;}());var CHARACTER_02 = (function(){var f ={};

const animation_database =
{
    idle: { max_frame:1 , max_speed:10, run_once:false },
    attack: { max_frame:4, max_speed:10, run_once:true }
};

f.environment = function(player)
{
    var data = 
    {
        "player1":{name:"default", tag:"both"},
        "player2":{name:"default", tag:"both"},   
    };

    var new_environment = 
    {
       name:data[player].name,
       tag:data[player].tag
    };

    return new_environment;
};

f.create = function(player_owner)
{
    if(player_owner === "player1")
    {
        var init_animation_tag = "left";
        var init_animation_name = "idle";
        var init_position = {x:0, y:1};
        var init_border_limit = { x:{min:0, max:1}, y:{min:0, max:2} };
    }
    else if(player_owner === "player2")
    {
        var init_animation_tag = "right";
        var init_animation_name = "idle";
        var init_position = {x:3, y:1};
        var init_border_limit = { x:{min:2, max:3}, y:{min:0, max:2} };
    };

    var new_character = 
    {
        info:
        {
            id:ENGINE_Utils.idGenerator(20),
            name: "character_02",
            class: "character",
            subclass: "character",  //used for collision targeting
            owner:player_owner,
            //When it has an expiration it means it will be destroyed
            //before the current phase will end.
            has_expiration:false,
        },
        model:
        {
            sprite: "character_02",
            size:{  w:70, h:70 }, //min 0 max 100
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
            can_move:false,
            border_limit: init_border_limit,
            has_border_limit: true,
            has_reached_border_limit:false,
        }
    };

    return new_character;
};

f.update = function(action,entity)
{   
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
            spells: ENGINE_Utils.copyObject( SPELLS.getSpellStats(player1_data.spells) ),
            environment: ENGINE_Utils.copyObject(CHARACTERS.getEnvironment(player1_data.character,"player1")),
            stats: { health:500,  health_max:500 },
            selected_spell: 0,
            selected_position: 0,
            status:[],
        },
        player2:
        {
            id: player2_data.id,
            name: player2_data.name,
            character: player2_data.character,
            blessing:player2_data.blessing,
            spells: ENGINE_Utils.copyObject( SPELLS.getSpellStats(player2_data.spells) ),
            environment: ENGINE_Utils.copyObject(CHARACTERS.getEnvironment(player2_data.character,"player2")),
            stats: { health:500,  health_max:500 },
            selected_spell:0,
            selected_position: 0,
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
                max_status_number:8,

            },
            phases:
            {
                stage:0,
                initialized: false,
                first_turn:"",
                second_turn:"",
            },
            player1:
            {
                succesful_cast:false,
                current_spell_selected:0,
                current_position_selected:0,
            },
            player2:
            {
                succesful_cast:false,
                current_spell_selected:0,
                current_position_selected:0,
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
            status:battledata[opponent].status,
            stats:
            {
                health: battledata[opponent].stats.health,
                health_max: battledata[opponent].stats.health_max,
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
            battledata_all[i].private.player1.current_position_selected = controls_data.position_selected;
        };

        //Update secret data for Player 2
        if(player_id === battledata_all[i].player2.id)
        {
            battledata_all[i].private.player2.current_spell_selected = controls_data.spell_selected;
            battledata_all[i].private.player2.current_position_selected = controls_data.position_selected;
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
                {   //In this part we will check if the battledata is gameover
                    //then lets add a cycle countdown before we remove it.
                    f.battledata_all[i].private.core.gameover_removal_countdown++;

                    if(f.battledata_all[i].private.core.gameover_removal_countdown <= 1000)
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

f.getExpiredEntitiesCount = function(battledata)
{
    var expired_entity = 0;

    for(var i = 0; i <= battledata.core.entities.length - 1;i++)
    {  
        if(Object.keys(battledata.core.entities[i]).length >= 1)
        {
            if(battledata.core.entities[i].info.has_expiration === true)
            {
                expired_entity++;
            };
        }
    };

    return expired_entity;
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
        clean_matchdata();
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

function clean_matchdata()
{
    var new_matchdata_all = [];

    f.matchdata_all.forEach(function(player)
    {
        if(player.matched !== true && player.canceled !== true)
        {
           new_matchdata_all.push(player)
        };
    });

    f.matchdata_all = new_matchdata_all;
};


return f;}());var ENGINE_Physics = (function(){var f ={};

f.updatePosition = function(target_entity,mode)
{
    if(target_entity.physics.can_move === true)
    {
        var new_position = f.newPosition(target_entity.info.owner,target_entity.physics.position,mode);
    }
    else
    {
        var new_position = target_entity.physics.position;
    };
   
    if(target_entity.physics.has_border_limit === true)
    {
        var result = f.applyBorderLimit(new_position,target_entity.physics.border_limit);

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

f.newPosition = function(owner,position,mode)
{   
    var new_position = {x:0, y:0};

    switch(mode)
    {
        case "straight-line":
            if(owner === "player1"){ new_position.x = position.x + 1; new_position.y = position.y }
            else{ new_position.x = position.x - 1; new_position.y = position.y };
        break;
    };

    return new_position;
};

f.applyBorderLimit = function(position,border_limit)
{   
    var new_position = ENGINE_Utils.copyObject(position);
    var has_reached_border_limit = false;

    if(position.x < border_limit.x.min)
    {
        new_position.x = border_limit.x.min;
        has_reached_border_limit = true;
    };

    if(position.x > border_limit.x.max)
    {   
        new_position.x = border_limit.x.max;
        has_reached_border_limit = true;
    };

    if(position.y < border_limit.y.min)
    {
        new_position.y = border_limit.y.min;
        has_reached_border_limit = true;
    };

    if(position.y > border_limit.y.max)
    {
        new_position.y = border_limit.y.max;
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
    var distance = f.getDistanceBetweenPoints(source_entity.physics.position,target_entity.physics.position);
    
    if(distance.x <= 0 && distance.y <= 0)
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

f.reduceCooldown = function(battledata)
{
    battledata.player1.spells = reduce(battledata.player1.spells);
    battledata.player2.spells = reduce(battledata.player2.spells);

    function reduce(spells)
    {
        spells.forEach(function(spell)
        {
            if(spell.cooldown_current >= 1)
            {
                spell.cooldown_current--;
            }
        });

        return spells;
    };

    return battledata;
};

f.getFirstTurner = function(battledata)
{
    //Now check speed to see who will cast
    var p1 = battledata.player1;
    var p2 = battledata.player2;

    var p1_speed = SPELLS.getSpellSpeed(p1.spells[p1.selected_spell].id,"player1",battledata );
    var p2_speed = SPELLS.getSpellSpeed(p2.spells[p2.selected_spell].id,"player2",battledata );

    var result = { first:"", second:"" };

    if(p1_speed > p2_speed){ result.first = "player1"; result.second = "player2"; }
    else if(p2_speed > p1_speed){ result.first = "player2"; result.second = "player1";  }
    else if(p1_speed === p2_speed)
    { 
        if(ENGINE_Utils.rng(1,100) <= 50){  result.first = "player1"; result.second = "player2"; }
        else{ result.first = "player2"; result.second = "player1";  };
    };

    battledata.private.phases.first_turn = result.first;
    battledata.private.phases.second_turn = result.second;

    return battledata;

};

f.castSpell = function(player_tag,battledata)
{   
    var player = battledata[player_tag];

    if(player.spells[player.selected_spell].cooldown_current <= 0 && player.selected_spell >= 1)
    {
        battledata.private[player_tag].succesful_cast = true;
        player.spells[player.selected_spell].cooldown_current = 0 + player.spells[player.selected_spell].cooldown_max;
        battledata = SPELLS.start(player_tag,player.spells[player.selected_spell].id,battledata);
    }
    else
    {
        battledata.private[player_tag].succesful_cast = false;
    };

    return battledata;
};

f.castStatus = function(player_tag,status_type,battledata)
{
    //Activate stats
    battledata[player_tag].status.forEach(function(status)
    {
        if(status.type === status_type && status.stacks >= 1)
        {
            battledata = STATUS.activateStatus(status.name,player_tag,battledata);
        };
    });

    //Remove statuses with 0 stacks;
    var new_statuses = [];

        battledata[player_tag].status.forEach(function(status)
        {
            if(status.stacks >= 1)
            {
                new_statuses.push(status);
            };
        });

        battledata[player_tag].status = new_statuses;

    return battledata;

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
    battledata = ENGINE_PlayerActions.reduceCooldown(battledata);

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
    //Now update the player position & spells from the private data
    battledata[player].selected_spell = battledata.private[player].current_spell_selected;
    battledata[player].selected_position = battledata.private[player].current_position_selected;
    
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
    //LET CHECK WHO WILL CAST FIRST AND SECOND
    battledata = ENGINE_PlayerActions.getFirstTurner(battledata);

    return battledata;
};

function update(battledata)
{
    //Update all the entities
    battledata = ENGINE_Entity.genericUpdate(battledata);

    //After every spell update check player healths
    battledata = ENGINE_Combat.detectBattleStatus(battledata);

    //Check if the character only remains then end the phase
    if(ENGINE_Entity.getExpiredEntitiesCount(battledata) <= 0)
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
    //LET FIRST PLAYER CAST THEIR TYPE B STATUS
    battledata = ENGINE_PlayerActions.castStatus(battledata.private.phases.first_turn,"B",battledata);

    //LET THE PLAYER MOVE
    var player = battledata.private.phases.first_turn;
    var player_character = ENGINE_Entity.getCharacter(player,battledata);
    var position = player_character.physics.position;

    switch(battledata[player].selected_position)
    {
        case 1:
            position.y--;
            if(position.y < 0){ position.y = 0; };
        break;
        case 2:
            position.y++;
            if(position.y > 2){ position.y = 2; };
        break;
    };

    player_character.physics.position = position;

    return battledata;
};

function update(battledata)
{
    //Update all the entities
    battledata = ENGINE_Entity.genericUpdate(battledata);

    //After every spell update check player healths
    battledata = ENGINE_Combat.detectBattleStatus(battledata);

    //Check if the character only remains then end the phase
    if(ENGINE_Entity.getExpiredEntitiesCount(battledata) <= 0)
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
    //LET SECOND PLAYER CAST THEIR TYPE B STATUS
    battledata = ENGINE_PlayerActions.castStatus(battledata.private.phases.second_turn,"B",battledata);

    //LET THE PLAYER MOVE
    var player = battledata.private.phases.second_turn;
    var player_character = ENGINE_Entity.getCharacter(player,battledata);
    var position = player_character.physics.position;

    switch(battledata[player].selected_position)
    {
        case 1:
            position.y--;
            if(position.y < 0){ position.y = 0; };
        break;
        case 2:
            position.y++;
            if(position.y > 2){ position.y = 2; };
        break;
    };

    player_character.physics.position = position;

    return battledata;
};

function update(battledata)
{
    //Update all the entities
    battledata = ENGINE_Entity.genericUpdate(battledata);

    //After every spell update check player healths
    battledata = ENGINE_Combat.detectBattleStatus(battledata);

    //Check if the character only remains then end the phase
    if(ENGINE_Entity.getExpiredEntitiesCount(battledata) <= 0)
    {
        battledata = end(battledata);
    };

    return battledata;
};

function end(battledata)
{
    battledata.private.phases.initialized = false;
    battledata.private.phases.stage = 4;

    return battledata;
};


return f;}());var PHASE_4 = (function(){var f ={};

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
    //LET CHECK WHO WILL CAST FIRST AND SECOND
    battledata = ENGINE_PlayerActions.getFirstTurner(battledata);

    return battledata;
};

function update(battledata)
{
    //Update all the entities
    battledata = ENGINE_Entity.genericUpdate(battledata);

    //After every spell update check player healths
    battledata = ENGINE_Combat.detectBattleStatus(battledata);

    //Check if the character only remains then end the phase
    if(ENGINE_Entity.getExpiredEntitiesCount(battledata) <= 0)
    {
        battledata = end(battledata);
    };

    return battledata;
};

function end(battledata)
{
    battledata.private.phases.initialized = false;
    battledata.private.phases.stage = 5;

    return battledata;
};


return f;}());var PHASE_5 = (function(){var f ={};

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

    //LET FIRST TURN PLAYER CAST SPELLS
    battledata = ENGINE_PlayerActions.castSpell(battledata.private.phases.first_turn,battledata);

    return battledata;
};

function update(battledata)
{   
    var player = battledata.private.phases.first_turn;

    //Play attack animation when successfully casted an spell
    if(battledata.private[player].succesful_cast === true)
    {
        var params = { battledata:battledata, mode:"attack", player:player };
        battledata = ENGINE_Entity.updateCharacter(params);
    };

    //Update all the entities
    battledata = ENGINE_Entity.genericUpdate(battledata);

    //After every spell update check player healths
    battledata = ENGINE_Combat.detectBattleStatus(battledata);
    
    //Check if the character only remains then end the phase
    if(ENGINE_Entity.getExpiredEntitiesCount(battledata) <= 0)
    {
        battledata = end(battledata);
    };
    
    return battledata;
};

function end(battledata)
{

    battledata.private.phases.initialized = false;
    battledata.private.phases.stage = 6;

    return battledata;
};


return f;}());var PHASE_6 = (function(){var f ={};

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

    //LET FIRST TURN PLAYER CAST SPELLS
    battledata = ENGINE_PlayerActions.castSpell(battledata.private.phases.second_turn,battledata);

    return battledata;
};

function update(battledata)
{   
    var player = battledata.private.phases.second_turn;
    
    //Play attack animation when successfully casted an spell
    if(battledata.private[player].succesful_cast === true)
    {
        var params = { battledata:battledata, mode:"attack", player:player };
        battledata = ENGINE_Entity.updateCharacter(params);
    };

    //Update all the entities in every phase
    battledata = ENGINE_Entity.genericUpdate(battledata);

    //During every phase check player healths
    battledata = ENGINE_Combat.detectBattleStatus(battledata);
    
    //Check if the character only remains then end the phase
    if(ENGINE_Entity.getExpiredEntitiesCount(battledata) <= 0)
    {
        battledata = end(battledata);
    };
    
    return battledata;
};

function end(battledata)
{

    battledata.private.phases.initialized = false;
    battledata.private.phases.stage = 7;

    return battledata;
};


return f;}());var PHASE_7 = (function(){var f ={};

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
    //LET CHECK WHO WILL CAST FIRST AND SECOND
    battledata = ENGINE_PlayerActions.getFirstTurner(battledata);

    return battledata;
};

function update(battledata)
{
    //Update all the entities
    battledata = ENGINE_Entity.genericUpdate(battledata);

    //After every spell update check player healths
    battledata = ENGINE_Combat.detectBattleStatus(battledata);

    //Make sure that no sfx even those who don't expired be cleared first
    if(ENGINE_Entity.getNonCharacterCount(battledata) <= 0)
    {
        battledata = end(battledata);
    };

    return battledata;
};
function end(battledata)
{
    battledata.private.phases.initialized = false;
    battledata.private.phases.stage = 8;

    return battledata;
};


return f;}());var PHASE_8 = (function(){var f ={};

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
    battledata = ENGINE_PlayerActions.castStatus(battledata.private.phases.first_turn,"C",battledata);

    return battledata;
};

function update(battledata)
{
    //Update all the entities
    battledata = ENGINE_Entity.genericUpdate(battledata);

    //After every spell update check player healths
    battledata = ENGINE_Combat.detectBattleStatus(battledata);

    //Check if the character only remains then end the phase
    if(ENGINE_Entity.getExpiredEntitiesCount(battledata) <= 0)
    {
        battledata = end(battledata);
    };

    return battledata;
};

function end(battledata)
{
    battledata.private.phases.initialized = false;
    battledata.private.phases.stage = 9;

    return battledata;
};


return f;}());var PHASE_9 = (function(){var f ={};

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
    battledata = ENGINE_PlayerActions.castStatus(battledata.private.phases.second_turn,"C",battledata);

    return battledata;
};

function update(battledata)
{
    //Update all the entities
    battledata = ENGINE_Entity.genericUpdate(battledata);

    //After every spell update check player healths
    battledata = ENGINE_Combat.detectBattleStatus(battledata);

    //Check if the character only remains then end the phase
    if(ENGINE_Entity.getExpiredEntitiesCount(battledata) <= 0)
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

/*
    !!!============REMEMBER========!!!
    The CLIENT GATE and SERVER GATE are used
    to communicate between the client and the
    server offline. Because the offline server
    is inside the Web Worker
*/

//self is not a variable. It refers to the Web Worker that
//activates the server offline which is found in 
//CLIENT_GATE.initialize();
self.onmessage = function(message)
{
    switch(message.data.title)
    {
        case "initialize":
            ENGINE.initialize();
        break;

        case "connect":
            //The connect_data is the 
            //message.data.content itself
            //No need to stringify the result
            //because it already is
            var result = ENGINE.connect(message.data.content);
            f.send( { title:"connect", content:result } );
        break;

        case "offline":
            //The connect_data is the 
            //message.data.content itself
            //No need to stringify the result
            //because it already is
            ENGINE.offline(message.data.content);
        break;

        case "localstorage_set":
            ENGINE_Core_Run.battledata_all = message.data.content.battledata_all;
            ENGINE_Matchmaking.matchdata_all = message.data.content.matchdata_all;
        break;

        case "localstorage_get":
            var result = 
            {
                battledata_all:ENGINE_Core_Run.battledata_all,
                matchdata_all:ENGINE_Matchmaking.matchdata_all
            };

            f.send( { title:"localstorage_get", content:result } );
        break;

    };
};

f.send = function(message)
{
    self.postMessage( message );
};


return f;}());




var SFX_ExplodeFire = (function(){var f ={};

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
            name: "explode_fire",
            class: "sfx",
            owner:player_owner,
            //When it has an expiration it means it will be destroyed
            //before the current phase will end.
            has_expiration:true,
        },
        model:
        {
            sprite: "explode_fire",
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
            name: "recharge",
            class: "sfx",
            owner:player_owner,
            //When it has an expiration it means it will be destroyed
            //before the current phase will end.
            has_expiration:true,
        },
        model:
        {
            sprite: "recharge",
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
            name: "replenish",
            class: "sfx",
            owner:player_owner,
            //When it has an expiration it means it will be destroyed
            //before the current phase will end.
            has_expiration:true,
        },
        model:
        {
            sprite: "replenish",
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
            name: "root",
            class: "sfx",
            owner:player_owner,
            //When it has an expiration it means it will be destroyed
            //before the current phase will end.
            has_expiration:true,
        },
        model:
        {
            sprite: "root",
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
        cast_speed_percentage:0, //1 to 100
        cooldown_current:0,
        cooldown_max:0
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
        cast_speed_percentage:50, //1 to 100
        cooldown_current:0,
        cooldown_max:4 //Min is 2
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

    var new_entity = {
        info:
        {
            id:ENGINE_Utils.idGenerator(20),
            name: "sp01",
            class: "spell",
            subclass:"projectile",
            owner:player_owner,
            //When it has an expiration it means it will be destroyed
            //before the current phase will end.
            has_expiration:true,
        },
        combat:
        {
            damage:100
        },
        model:
        {
            sprite: "energy_ball",
            size:{  w:50, h:50 }, //min 0 max 100
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
            can_move:true,
            border_limit: { x:{min:0, max:3}, y:{min:0, max:2} },
            has_border_limit: true,
            has_reached_border_limit:false,
        }
    }

    battledata.core.entities.push(ENGINE_Utils.copyObject(new_entity));

    return battledata;
};

f.genericUpdate = function(entity,battledata)
{   
    if(battledata.private.core.time % 20 === 0)
    {   
        entity = ENGINE_Physics.updatePosition(entity,"straight-line");

        var colliders = ENGINE_Physics.getColliders(entity,battledata,["character"]);

        if(colliders.length >= 1)
        {
            //We need to use for loop to break the looping
            //once we encountered our first subclass
            for(var i = 0; i <= colliders.length - 1;i++)
            {
                if(colliders[i].info.subclass === "character")
                {
                    var new_sfx = SFX.create(entity.info.owner,"explode_fire",{ size:colliders[i].model.size, position:colliders[i].physics.position});
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
        };
    };

    return battledata;
};

return f;}());var SPELL_02 = (function(){var f ={};

f.getSpellStats = function()
{
    var stat = 
    {
        id:"sp02",
        cast_speed_percentage:50, //1 to 100
        cooldown_current:0,
        cooldown_max:2 //min is 2
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

    var new_entity = {
        info:
        {
            id:ENGINE_Utils.idGenerator(20),
            name: "sp02",
            class: "spell",
            subclass:"shield", //used for collision targeting
            owner:player_owner,
            //When it has an expiration it means it will be destroyed
            //before the current phase will end. 
            has_expiration:false,
        },
        combat:
        {
            //When this spell is cast at phase 7 then it will be removed
            //immediately. So for casting clarification we need it to
            //linger for a few milliseconds before removing
            linger_time:3,

            //The phase where it will be destroyed
            phase_end:7 
        },
        model:
        {
            sprite: "shield_blue",
            size: { w:caster_entity.model.size.w+10, h:caster_entity.model.size.h+10 }, //min 0 max 100
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
            can_move:false,
            has_border_limit: false,
        }
    }

    battledata.core.entities.push(ENGINE_Utils.copyObject(new_entity));

    return battledata;
};

f.genericUpdate = function(entity,battledata)
{   
        if(battledata.private.phases.stage === entity.combat.phase_end)
        {   
            if(battledata.private.core.time % 100 === 0)
            {   
                entity.combat.linger_time--;

                if(entity.combat.linger_time <= 0)
                {
                    battledata = ENGINE_Entity.deleteEntity(entity,battledata);
                };
            };
        };

    return battledata;
};

return f;}());var SPELL_03 = (function(){var f ={};

f.getSpellStats = function()
{
    var stat = 
    {
        id:"sp03",
        cast_speed_percentage:50, //1 to 100
        cooldown_current:0,
        cooldown_max:2 //min is 2
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
    var model_tag = "";

    if(player_owner === "player1")
    {
        model_tag = "left";
    }
    else if(player_owner === "player2")
    {
        model_tag = "right";
    };

    var new_entity = 
    {
        info:
        {
            id:ENGINE_Utils.idGenerator(20),
            name: "sp03",
            class: "spell",
            subclass:"beam",
            owner:player_owner,
            //When it has an expiration it means it will be destroyed
            //before the current phase will end.
            has_expiration:true,
        },
        combat:
        {
            duration:0,
            damage:1000,
            already_hit_targets:[]
        }
    }

    battledata.core.entities.push(ENGINE_Utils.copyObject(new_entity));

    battledata = createEntity(player_owner,model_tag,0,caster_entity.physics.position,battledata);
   
    return battledata;
};

f.genericUpdate = function(entity,battledata)
{   
    if(battledata.private.core.time % 20 === 0)
    {
        entity.combat.duration++;

        if(entity.combat.duration <= 3)
        {  
            var caster_entity = ENGINE_Entity.getCharacter(entity.info.owner,battledata);
            var caster_pos = caster_entity.physics.position;
    
            if(entity.info.owner === "player1")
            {
                var model_tag = "left";
                var new_position = { x:caster_pos.x + entity.combat.duration, y:caster_pos.y } 
            }
            else if(entity.info.owner === "player2")
            {
                var model_tag = "right";
                var new_position = { x:caster_pos.x - entity.combat.duration, y:caster_pos.y } 
            }
    
            battledata = createEntity(entity.info.owner,model_tag,entity.combat.duration,new_position,battledata);
    
        };

    };

    var beam_count = 0;

    for(var i = 0; i <= battledata.core.entities.length - 1; i++)
    {  
        if(Object.keys(battledata.core.entities[i]).length >= 1)
        {
            if(battledata.core.entities[i].info.owner === entity.info.owner)
            {
                if(battledata.core.entities[i].info.name === "sp03_beam")
                {
                    beam_count++;

                    var colliders = ENGINE_Physics.getColliders(battledata.core.entities[i],battledata,["character"]);

                    if(colliders.length >= 1)
                    {
                        for(var n = 0; n <= colliders.length - 1;n++)
                        {  
                            if(entity.combat.already_hit_targets.indexOf(colliders[n].info.id) < 0)
                            {
                                if(colliders[n].info.subclass === "character")
                                {
                                    entity.combat.already_hit_targets.push(colliders[n].info.id);
                                    battledata = ENGINE_Combat.playerCombat(battledata,entity.info.owner,colliders[n].info.owner,entity);
                                };
                            };
                        };
                    };

                    if(entity.combat.duration >= 4)
                    {
                        battledata = ENGINE_Entity.deleteEntity(battledata.core.entities[i],battledata);
                    };

                };
            };
        };
    };    


    if(beam_count === 0 && entity.combat.duration >= 4)
    {
        battledata = ENGINE_Entity.deleteEntity(entity,battledata);
    };

    return battledata;
};


function createEntity(player_owner,model_tag,frame_count,position,battledata)
{
    var new_entity = 
    {
        info:
        {
            id:ENGINE_Utils.idGenerator(20),
            name: "sp03_beam",
            class: "spell",
            subclass:"beam",
            owner:player_owner,
            //When it has an expiration it means it will be destroyed
            //before the current phase will end.
            has_expiration:true,
        },
        model:
        {
            sprite: "fire_beam",
            size: { w:100, h:50 }, //min 0 max 100
            animation:
            {
                tag: model_tag,
                name: "idle",
                frame_count:frame_count,
                speed_count:0,
            }
        },
        physics:
        {
            old_position:{},//Dont remove this stat
            position:position,
            can_move:false,
            has_border_limit: false,
        }
    };

    battledata.core.entities.push(ENGINE_Utils.copyObject(new_entity));
    
    return battledata;

};

return f;}());var SPELL_04 = (function(){var f ={};

f.getSpellStats = function()
{
    var stat = 
    {
        id:"sp04",
        cast_speed_percentage:50, //1 to 100
        cooldown_current:0,
        cooldown_max:2 //min is 2
    };

    return stat;
};

f.getSpeed = function()
{
    var speed = ENGINE_Utils.rng(1,100);
    return speed;
};

f.start = function(player_owner,battledata)
{
    var new_entity = 
    {
        info:
        {
            id:ENGINE_Utils.idGenerator(20),
            name: "sp04",
            class: "spell",
            subclass:"projectile",
            owner:player_owner,
            //When it has an expiration it means it will be destroyed
            //before the current phase will end.
            has_expiration:true,
        },
        combat:
        {
            duration:0,
            duration_targets:[ 1,4,7] //the duration when a fireball is created
        }
    }

    battledata.core.entities.push(ENGINE_Utils.copyObject(new_entity));
   
    return battledata;
};

f.genericUpdate = function(entity,battledata)
{   
    if(battledata.private.core.time % 10 === 0)
    {
        entity.combat.duration++;

        var caster_entity = ENGINE_Entity.getCharacter(entity.info.owner,battledata);

        if(entity.combat.duration_targets.indexOf(entity.combat.duration) >= 0)
        {
            var owner = entity.info.owner;
            var tag = {player1:"left",player2:"right"};

            battledata = createFireProjectile(owner,tag[owner],caster_entity.physics.position,battledata);    
        };
    };

    if(battledata.private.core.time % 10 === 0)
    {
        var projectile_remaining = 0;

        for(var i = 0; i <= battledata.core.entities.length - 1; i++)
        {  
            if(Object.keys(battledata.core.entities[i]).length >= 1)
            {
                if(battledata.core.entities[i].info.owner === entity.info.owner)
                {
                    if(battledata.core.entities[i].info.name === "sp04_projectile")
                    {
                        projectile_remaining++;
                        battledata = updateFireProjectile(battledata.core.entities[i],battledata);
                    };
                };
            };
        };    
    };

    if(projectile_remaining <= 0)
    {
        battledata = ENGINE_Entity.deleteEntity(entity,battledata);
    };

    return battledata;
};


function createFireProjectile(owner,animation_tag,position,battledata)
{
    var new_entity = {
        info:
        {
            id:ENGINE_Utils.idGenerator(20),
            name: "sp04_projectile",
            class: "spell",
            subclass:"projectile",
            owner:owner,
            //When it has an expiration it means it will be destroyed
            //before the current phase will end.
            has_expiration:true,
        },
        combat:
        {
            damage:10
        },
        model:
        {
            sprite: "rain_of_fire",
            size: { w:60, h:20 },
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
            can_move:true,
            border_limit: { x:{min:0, max:3}, y:{min:0, max:2} },
            has_border_limit: true,
            has_reached_border_limit:false,
        }
    }

    battledata.core.entities.push(ENGINE_Utils.copyObject(new_entity));

    return battledata;
};

function updateFireProjectile(entity,battledata)
{   
    entity = ENGINE_Physics.updatePosition(entity,"straight-line");
    
    var colliders = ENGINE_Physics.getColliders(entity,battledata,["character"]);

    if(colliders.length >= 1)
    {
        //We need to use for loop to break the looping
        //once we encountered our first subclass
        for(var i = 0; i <= colliders.length - 1;i++)
        {
            if(colliders[i].info.subclass === "character")
            {
                var new_sfx = SFX.create(entity.info.owner,"explode_fire",{ size:colliders[i].model.size, position:colliders[i].physics.position });
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
    var new_sfx = SFX.create(player_owner,"recharge",{ size:target_entity.model.size, position:target_entity.physics.position } );
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
    var new_sfx = SFX.create(player_owner,"replenish",{ size:target_entity.model.size, position:target_entity.physics.position } );
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

    var size = target_entity.model.size
    var position = {x:0, y:0};
    position.x = target_entity.physics.position.x;
    position.y = target_entity.physics.position.y;

    var new_sfx = SFX.create(player_owner,"root",{size:size, position:position});
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





return f;}());var CHARACTERS = (function(){var f ={};

f.create = function(player_owner,character_name,battledata)
{   
    switch(character_name)
    {
        case "character_01": return CHARACTER_01.create(player_owner,battledata); break;
        case "character_02": return CHARACTER_02.create(player_owner,battledata); break;
        default: alert(character_name + " does not exist"); return battledata; break;
    };
};

f.update = function(action,entity,battledata)
{
    switch(entity.info.name)
    {
        case "character_01": return CHARACTER_01.update(action,entity,battledata); break;
        case "character_02": return CHARACTER_02.update(action,entity,battledata); break;
        default: alert(entity.info.name + " does not exist"); return battledata; break;
    };
};

f.getEnvironment = function(character_name,player)
{
    switch(character_name)
    {
        case "character_01": return CHARACTER_01.environment(player); break;
        case "character_02": return CHARACTER_02.environment(player); break;
        default: alert(character_name + " does not exist"); return battledata; break;
    };
    
};

return f;}());var ENGINE = (function(){var f ={};

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
    //used in ONLINE SERVER only
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

return f;}());var PHASES = (function(){var f ={};

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
        case 4: battledata = PHASE_4.run(battledata); break;
        case 5: battledata = PHASE_5.run(battledata); break;
        case 6: battledata = PHASE_6.run(battledata); break;
        case 7: battledata = PHASE_7.run(battledata); break;
        case 8: battledata = PHASE_8.run(battledata); break;
        case 9: battledata = PHASE_9.run(battledata); break;
        case 10: battledata = PHASE_10.run(battledata); break;
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
        case "explode_fire": return SFX_ExplodeFire.create(player_owner,sfx_data); break;
        case "recharge": return SFX_Recharge.create(player_owner,sfx_data); break;
        case "replenish": return SFX_Replenish.create(player_owner,sfx_data); break;
        case "root": return SFX_Root.create(player_owner,sfx_data); break;
        default: alert(sfx_name + " does not exist"); break;
    };
};

f.genericUpdate = function(entity,battledata)
{
    switch(entity.info.name)
    {
        case "explode_fire": return SFX_ExplodeFire.genericUpdate(entity,battledata); break;
        case "recharge": return SFX_Recharge.genericUpdate(entity,battledata); break;
        case "replenish": return SFX_Replenish.genericUpdate(entity,battledata); break;
        case "root": return SFX_Root.genericUpdate(entity,battledata); break;
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


return f;}());/*This comment was created to prevent the white square from popping up and causing error.*/ 
