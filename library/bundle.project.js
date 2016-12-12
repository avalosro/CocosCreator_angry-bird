require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Angry_AtrapaHuevos":[function(require,module,exports){
"use strict";
cc._RFpush(module, '78c7ehMnEFIyYDqFb4PCIXv', 'Angry_AtrapaHuevos');
// Scripts\Angry_AtrapaHuevos.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        // Altura del salto del personaje principal
        jumpHeight: 0,
        // Duración del salto del personaje principal
        jumpDuration: 0,
        // Velocidad de movimiento máxima
        maxMoveSpeed: 0,
        // Aceleración
        accel: 0,
        //Si queremo que inicie automaticamente saltando
        Jumpin: true
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.Jumpin = true;
        /*Iniciando codigo para hacer que nuestro angry brinque sin parar*/

        // inicializando accion de salto (jump action)
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);
        /*Finalizando codigo para hacer que nuestro angry brinque sin parar*/

        // cambio de dirección de aceleración (switch of acceleration direction)
        this.accLeft = false;
        this.accRight = false;
        // Velocidad horizontal actual del personaje principal(current horizontal speed of main character)
        this.xSpeed = 0;

        // Inicializar el receptor de entrada de teclado(initialize keyboard input listener)
        this.setInputControl();
    },
    setJumpAction: function setJumpAction() {
        // Salto arriva (jump up))
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // Salto abajo (jump down)
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // Repetir(repeat)
        if (this.Jumpin == true) {
            return cc.repeatForever(cc.sequence(jumpUp, jumpDown));
        } else {
            return cc.sequence(jumpUp, jumpDown);
        }
    },
    setInputControl: function setInputControl() {
        var self = this;
        // add keyboard event listener
        // agrega el receptor de eventos de teclado
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // When there is a key being pressed down, judge if it's the designated directional button and set up acceleration in the corresponding direction
            // Cuando se pulsa una tecla, juzga si es el botón direccional designado y configura la aceleración en la dirección correspondiente
            onKeyPressed: function onKeyPressed(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.left:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.right:
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                    case cc.KEY.up:
                        self.Jumpin = true;
                        self.jumpAction = self.setJumpAction();
                        self.node.runAction(self.jumpAction);
                        break;
                    case cc.KEY.down:
                        //self.Jumpin = false;
                        //self.jumpHeight = 0;
                        //self.jumpAction = self.setJumpAction();
                        //self.node.runAction(self.jumpAction.reverse());
                        break;
                }
            },
            // when releasing the button, stop acceleration in this direction
            // al soltar el botón, detener la aceleración en esta dirección
            onKeyReleased: function onKeyReleased(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.left:
                        self.accLeft = false;
                        break;
                    case cc.KEY.right:
                        self.accRight = false;
                        break;
                }
            }
        }, self.node);
    },

    update: function update(dt) {
        // update speed of each frame according to the current acceleration direction
        // Actualizar velocidad de cada trama de acuerdo con la dirección de aceleración actual
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        // Restrict the movement speed of the main character to the maximum movement speed
        // Restringir la velocidad de movimiento del personaje principal a la velocidad máxima de movimiento
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reaches its limit, use the max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // Update the position of the main character according to the current speed
        // Actualizar la posición del personaje principal de acuerdo con la velocidad actual
        this.node.x += this.xSpeed * dt;
    }
});

cc._RFpop();
},{}],"Game":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'daa22NLJ8pK6LUyqzy8arj5', 'Game');
// Scripts\Game.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // this property quotes the PreFab resource of stars
        starPrefab: {
            'default': null,
            type: cc.Prefab
        },
        // the random scale of disappearing time for stars
        maxStarDuration: 0,
        minStarDuration: 0,
        // ground node for confirming the height of the generated star's position
        ground: {
            'default': null,
            type: cc.Node
        },
        // player node for obtaining the jump height of the main character and controlling the movement switch of the main character
        player: {
            'default': null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        // obtain the anchor point of ground level on the y axis
        this.groundY = this.ground.y + this.ground.height / 2; // this.ground.top may also work
        // generate a new star
        this.spawnNewStar();
    },

    spawnNewStar: function spawnNewStar() {
        // generate a new node in the scene with a preset template
        var newStar = cc.instantiate(this.starPrefab);
        // put the newly added node under the Canvas node
        this.node.addChild(newStar);
        // set up a random position for the star
        newStar.setPosition(this.getNewStarPosition());
    },

    getNewStarPosition: function getNewStarPosition() {
        var randX = 0;
        // According to the position of the ground level and the main character's jump height, randomly obtain an anchor point of the star on the y axis
        var randY = this.groundY + cc.random0To1() * this.player.getComponent('Angry_AtrapaHuevos').jumpHeight + 50;
        // according to the width of the screen, randomly obtain an anchor point of star on the x axis
        var maxX = this.node.width / 2;
        randX = cc.randomMinus1To1() * maxX;
        // return to the anchor point of the star
        return cc.p(randX, randY);
    }

});

cc._RFpop();
},{}],"Huevo":[function(require,module,exports){
"use strict";
cc._RFpush(module, '38f2esQC3ZKKbnveiZd/r0B', 'Huevo');
// Scripts\Huevo.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // When the distance between the egg and main character is less than this value, collection of the point will be completed
        // Cuando la distancia entre la huevo y el personaje principal es menor que este valor, la recopilación del punto se completará
        pickRadius: 0
    },

    // use this for initialization
    onLoad: function onLoad() {}
});
/*
getPlayerDistance: function () {
    // 根据 player 节点位置判断距离
    var playerPos = this.game.player.getPosition();
    // 根据两点位置计算两点之间距离
    var dist = cc.pDistance(this.node.position, playerPos);
    return dist;
},
  onPicked: function() {
    // 当星星被收集时，调用 Game 脚本中的接口，生成一个新的星星
    this.game.spawnNewStar();
    // 调用 Game 脚本的得分方法
    this.game.gainScore();
    // 然后销毁当前星星节点
    this.node.destroy();
},
  // called every frame
update: function (dt) {
    // 每帧判断和主角之间的距离是否小于收集距离
    if (this.getPlayerDistance() < this.pickRadius) {
        // 调用收集行为
        this.onPicked();
        return;
    }
    // 根据 Game 脚本中的计时器更新星星的透明度
    var opacityRatio = 1 - this.game.timer/this.game.starDuration;
    var minOpacity = 50;
    this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
},
*/

cc._RFpop();
},{}]},{},["Huevo","Angry_AtrapaHuevos","Game"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL0NvY29zQ3JlYXRvci9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9TY3JpcHRzL0FuZ3J5X0F0cmFwYUh1ZXZvcy5qcyIsImFzc2V0cy9TY3JpcHRzL0dhbWUuanMiLCJhc3NldHMvU2NyaXB0cy9IdWV2by5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3OGM3ZWhNbkVGSXlZRHFGYjRQQ0lYdicsICdBbmdyeV9BdHJhcGFIdWV2b3MnKTtcbi8vIFNjcmlwdHNcXEFuZ3J5X0F0cmFwYUh1ZXZvcy5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgLy8gQWx0dXJhIGRlbCBzYWx0byBkZWwgcGVyc29uYWplIHByaW5jaXBhbFxuICAgICAgICBqdW1wSGVpZ2h0OiAwLFxuICAgICAgICAvLyBEdXJhY2nDs24gZGVsIHNhbHRvIGRlbCBwZXJzb25hamUgcHJpbmNpcGFsXG4gICAgICAgIGp1bXBEdXJhdGlvbjogMCxcbiAgICAgICAgLy8gVmVsb2NpZGFkIGRlIG1vdmltaWVudG8gbcOheGltYVxuICAgICAgICBtYXhNb3ZlU3BlZWQ6IDAsXG4gICAgICAgIC8vIEFjZWxlcmFjacOzblxuICAgICAgICBhY2NlbDogMCxcbiAgICAgICAgLy9TaSBxdWVyZW1vIHF1ZSBpbmljaWUgYXV0b21hdGljYW1lbnRlIHNhbHRhbmRvXG4gICAgICAgIEp1bXBpbjogdHJ1ZVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5KdW1waW4gPSB0cnVlO1xuICAgICAgICAvKkluaWNpYW5kbyBjb2RpZ28gcGFyYSBoYWNlciBxdWUgbnVlc3RybyBhbmdyeSBicmlucXVlIHNpbiBwYXJhciovXG5cbiAgICAgICAgLy8gaW5pY2lhbGl6YW5kbyBhY2Npb24gZGUgc2FsdG8gKGp1bXAgYWN0aW9uKVxuICAgICAgICB0aGlzLmp1bXBBY3Rpb24gPSB0aGlzLnNldEp1bXBBY3Rpb24oKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbih0aGlzLmp1bXBBY3Rpb24pO1xuICAgICAgICAvKkZpbmFsaXphbmRvIGNvZGlnbyBwYXJhIGhhY2VyIHF1ZSBudWVzdHJvIGFuZ3J5IGJyaW5xdWUgc2luIHBhcmFyKi9cblxuICAgICAgICAvLyBjYW1iaW8gZGUgZGlyZWNjacOzbiBkZSBhY2VsZXJhY2nDs24gKHN3aXRjaCBvZiBhY2NlbGVyYXRpb24gZGlyZWN0aW9uKVxuICAgICAgICB0aGlzLmFjY0xlZnQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hY2NSaWdodCA9IGZhbHNlO1xuICAgICAgICAvLyBWZWxvY2lkYWQgaG9yaXpvbnRhbCBhY3R1YWwgZGVsIHBlcnNvbmFqZSBwcmluY2lwYWwoY3VycmVudCBob3Jpem9udGFsIHNwZWVkIG9mIG1haW4gY2hhcmFjdGVyKVxuICAgICAgICB0aGlzLnhTcGVlZCA9IDA7XG5cbiAgICAgICAgLy8gSW5pY2lhbGl6YXIgZWwgcmVjZXB0b3IgZGUgZW50cmFkYSBkZSB0ZWNsYWRvKGluaXRpYWxpemUga2V5Ym9hcmQgaW5wdXQgbGlzdGVuZXIpXG4gICAgICAgIHRoaXMuc2V0SW5wdXRDb250cm9sKCk7XG4gICAgfSxcbiAgICBzZXRKdW1wQWN0aW9uOiBmdW5jdGlvbiBzZXRKdW1wQWN0aW9uKCkge1xuICAgICAgICAvLyBTYWx0byBhcnJpdmEgKGp1bXAgdXApKVxuICAgICAgICB2YXIganVtcFVwID0gY2MubW92ZUJ5KHRoaXMuanVtcER1cmF0aW9uLCBjYy5wKDAsIHRoaXMuanVtcEhlaWdodCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25PdXQoKSk7XG4gICAgICAgIC8vIFNhbHRvIGFiYWpvIChqdW1wIGRvd24pXG4gICAgICAgIHZhciBqdW1wRG93biA9IGNjLm1vdmVCeSh0aGlzLmp1bXBEdXJhdGlvbiwgY2MucCgwLCAtdGhpcy5qdW1wSGVpZ2h0KSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbkluKCkpO1xuICAgICAgICAvLyBSZXBldGlyKHJlcGVhdClcbiAgICAgICAgaWYgKHRoaXMuSnVtcGluID09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBjYy5yZXBlYXRGb3JldmVyKGNjLnNlcXVlbmNlKGp1bXBVcCwganVtcERvd24pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjYy5zZXF1ZW5jZShqdW1wVXAsIGp1bXBEb3duKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0SW5wdXRDb250cm9sOiBmdW5jdGlvbiBzZXRJbnB1dENvbnRyb2woKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gYWRkIGtleWJvYXJkIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgIC8vIGFncmVnYSBlbCByZWNlcHRvciBkZSBldmVudG9zIGRlIHRlY2xhZG9cbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKHtcbiAgICAgICAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLktFWUJPQVJELFxuICAgICAgICAgICAgLy8gV2hlbiB0aGVyZSBpcyBhIGtleSBiZWluZyBwcmVzc2VkIGRvd24sIGp1ZGdlIGlmIGl0J3MgdGhlIGRlc2lnbmF0ZWQgZGlyZWN0aW9uYWwgYnV0dG9uIGFuZCBzZXQgdXAgYWNjZWxlcmF0aW9uIGluIHRoZSBjb3JyZXNwb25kaW5nIGRpcmVjdGlvblxuICAgICAgICAgICAgLy8gQ3VhbmRvIHNlIHB1bHNhIHVuYSB0ZWNsYSwganV6Z2Egc2kgZXMgZWwgYm90w7NuIGRpcmVjY2lvbmFsIGRlc2lnbmFkbyB5IGNvbmZpZ3VyYSBsYSBhY2VsZXJhY2nDs24gZW4gbGEgZGlyZWNjacOzbiBjb3JyZXNwb25kaWVudGVcbiAgICAgICAgICAgIG9uS2V5UHJlc3NlZDogZnVuY3Rpb24gb25LZXlQcmVzc2VkKGtleUNvZGUsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmxlZnQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY0xlZnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NSaWdodCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLnJpZ2h0OlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NMZWZ0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY1JpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS51cDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuSnVtcGluID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuanVtcEFjdGlvbiA9IHNlbGYuc2V0SnVtcEFjdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5ub2RlLnJ1bkFjdGlvbihzZWxmLmp1bXBBY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmRvd246XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NlbGYuSnVtcGluID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NlbGYuanVtcEhlaWdodCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NlbGYuanVtcEFjdGlvbiA9IHNlbGYuc2V0SnVtcEFjdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9zZWxmLm5vZGUucnVuQWN0aW9uKHNlbGYuanVtcEFjdGlvbi5yZXZlcnNlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIHdoZW4gcmVsZWFzaW5nIHRoZSBidXR0b24sIHN0b3AgYWNjZWxlcmF0aW9uIGluIHRoaXMgZGlyZWN0aW9uXG4gICAgICAgICAgICAvLyBhbCBzb2x0YXIgZWwgYm90w7NuLCBkZXRlbmVyIGxhIGFjZWxlcmFjacOzbiBlbiBlc3RhIGRpcmVjY2nDs25cbiAgICAgICAgICAgIG9uS2V5UmVsZWFzZWQ6IGZ1bmN0aW9uIG9uS2V5UmVsZWFzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkubGVmdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjTGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLnJpZ2h0OlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NSaWdodCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCBzZWxmLm5vZGUpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICAvLyB1cGRhdGUgc3BlZWQgb2YgZWFjaCBmcmFtZSBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgYWNjZWxlcmF0aW9uIGRpcmVjdGlvblxuICAgICAgICAvLyBBY3R1YWxpemFyIHZlbG9jaWRhZCBkZSBjYWRhIHRyYW1hIGRlIGFjdWVyZG8gY29uIGxhIGRpcmVjY2nDs24gZGUgYWNlbGVyYWNpw7NuIGFjdHVhbFxuICAgICAgICBpZiAodGhpcy5hY2NMZWZ0KSB7XG4gICAgICAgICAgICB0aGlzLnhTcGVlZCAtPSB0aGlzLmFjY2VsICogZHQ7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hY2NSaWdodCkge1xuICAgICAgICAgICAgdGhpcy54U3BlZWQgKz0gdGhpcy5hY2NlbCAqIGR0O1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlc3RyaWN0IHRoZSBtb3ZlbWVudCBzcGVlZCBvZiB0aGUgbWFpbiBjaGFyYWN0ZXIgdG8gdGhlIG1heGltdW0gbW92ZW1lbnQgc3BlZWRcbiAgICAgICAgLy8gUmVzdHJpbmdpciBsYSB2ZWxvY2lkYWQgZGUgbW92aW1pZW50byBkZWwgcGVyc29uYWplIHByaW5jaXBhbCBhIGxhIHZlbG9jaWRhZCBtw6F4aW1hIGRlIG1vdmltaWVudG9cbiAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMueFNwZWVkKSA+IHRoaXMubWF4TW92ZVNwZWVkKSB7XG4gICAgICAgICAgICAvLyBpZiBzcGVlZCByZWFjaGVzIGl0cyBsaW1pdCwgdXNlIHRoZSBtYXggc3BlZWQgd2l0aCBjdXJyZW50IGRpcmVjdGlvblxuICAgICAgICAgICAgdGhpcy54U3BlZWQgPSB0aGlzLm1heE1vdmVTcGVlZCAqIHRoaXMueFNwZWVkIC8gTWF0aC5hYnModGhpcy54U3BlZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBwb3NpdGlvbiBvZiB0aGUgbWFpbiBjaGFyYWN0ZXIgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHNwZWVkXG4gICAgICAgIC8vIEFjdHVhbGl6YXIgbGEgcG9zaWNpw7NuIGRlbCBwZXJzb25hamUgcHJpbmNpcGFsIGRlIGFjdWVyZG8gY29uIGxhIHZlbG9jaWRhZCBhY3R1YWxcbiAgICAgICAgdGhpcy5ub2RlLnggKz0gdGhpcy54U3BlZWQgKiBkdDtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2RhYTIyTkxKOHBLNkxVeXF6eThhcmo1JywgJ0dhbWUnKTtcbi8vIFNjcmlwdHNcXEdhbWUuanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyB0aGlzIHByb3BlcnR5IHF1b3RlcyB0aGUgUHJlRmFiIHJlc291cmNlIG9mIHN0YXJzXG4gICAgICAgIHN0YXJQcmVmYWI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuICAgICAgICAvLyB0aGUgcmFuZG9tIHNjYWxlIG9mIGRpc2FwcGVhcmluZyB0aW1lIGZvciBzdGFyc1xuICAgICAgICBtYXhTdGFyRHVyYXRpb246IDAsXG4gICAgICAgIG1pblN0YXJEdXJhdGlvbjogMCxcbiAgICAgICAgLy8gZ3JvdW5kIG5vZGUgZm9yIGNvbmZpcm1pbmcgdGhlIGhlaWdodCBvZiB0aGUgZ2VuZXJhdGVkIHN0YXIncyBwb3NpdGlvblxuICAgICAgICBncm91bmQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgLy8gcGxheWVyIG5vZGUgZm9yIG9idGFpbmluZyB0aGUganVtcCBoZWlnaHQgb2YgdGhlIG1haW4gY2hhcmFjdGVyIGFuZCBjb250cm9sbGluZyB0aGUgbW92ZW1lbnQgc3dpdGNoIG9mIHRoZSBtYWluIGNoYXJhY3RlclxuICAgICAgICBwbGF5ZXI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgLy8gb2J0YWluIHRoZSBhbmNob3IgcG9pbnQgb2YgZ3JvdW5kIGxldmVsIG9uIHRoZSB5IGF4aXNcbiAgICAgICAgdGhpcy5ncm91bmRZID0gdGhpcy5ncm91bmQueSArIHRoaXMuZ3JvdW5kLmhlaWdodCAvIDI7IC8vIHRoaXMuZ3JvdW5kLnRvcCBtYXkgYWxzbyB3b3JrXG4gICAgICAgIC8vIGdlbmVyYXRlIGEgbmV3IHN0YXJcbiAgICAgICAgdGhpcy5zcGF3bk5ld1N0YXIoKTtcbiAgICB9LFxuXG4gICAgc3Bhd25OZXdTdGFyOiBmdW5jdGlvbiBzcGF3bk5ld1N0YXIoKSB7XG4gICAgICAgIC8vIGdlbmVyYXRlIGEgbmV3IG5vZGUgaW4gdGhlIHNjZW5lIHdpdGggYSBwcmVzZXQgdGVtcGxhdGVcbiAgICAgICAgdmFyIG5ld1N0YXIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnN0YXJQcmVmYWIpO1xuICAgICAgICAvLyBwdXQgdGhlIG5ld2x5IGFkZGVkIG5vZGUgdW5kZXIgdGhlIENhbnZhcyBub2RlXG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcbiAgICAgICAgLy8gc2V0IHVwIGEgcmFuZG9tIHBvc2l0aW9uIGZvciB0aGUgc3RhclxuICAgICAgICBuZXdTdGFyLnNldFBvc2l0aW9uKHRoaXMuZ2V0TmV3U3RhclBvc2l0aW9uKCkpO1xuICAgIH0sXG5cbiAgICBnZXROZXdTdGFyUG9zaXRpb246IGZ1bmN0aW9uIGdldE5ld1N0YXJQb3NpdGlvbigpIHtcbiAgICAgICAgdmFyIHJhbmRYID0gMDtcbiAgICAgICAgLy8gQWNjb3JkaW5nIHRvIHRoZSBwb3NpdGlvbiBvZiB0aGUgZ3JvdW5kIGxldmVsIGFuZCB0aGUgbWFpbiBjaGFyYWN0ZXIncyBqdW1wIGhlaWdodCwgcmFuZG9tbHkgb2J0YWluIGFuIGFuY2hvciBwb2ludCBvZiB0aGUgc3RhciBvbiB0aGUgeSBheGlzXG4gICAgICAgIHZhciByYW5kWSA9IHRoaXMuZ3JvdW5kWSArIGNjLnJhbmRvbTBUbzEoKSAqIHRoaXMucGxheWVyLmdldENvbXBvbmVudCgnQW5ncnlfQXRyYXBhSHVldm9zJykuanVtcEhlaWdodCArIDUwO1xuICAgICAgICAvLyBhY2NvcmRpbmcgdG8gdGhlIHdpZHRoIG9mIHRoZSBzY3JlZW4sIHJhbmRvbWx5IG9idGFpbiBhbiBhbmNob3IgcG9pbnQgb2Ygc3RhciBvbiB0aGUgeCBheGlzXG4gICAgICAgIHZhciBtYXhYID0gdGhpcy5ub2RlLndpZHRoIC8gMjtcbiAgICAgICAgcmFuZFggPSBjYy5yYW5kb21NaW51czFUbzEoKSAqIG1heFg7XG4gICAgICAgIC8vIHJldHVybiB0byB0aGUgYW5jaG9yIHBvaW50IG9mIHRoZSBzdGFyXG4gICAgICAgIHJldHVybiBjYy5wKHJhbmRYLCByYW5kWSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzM4ZjJlc1FDM1pLS2JudmVpWmQvcjBCJywgJ0h1ZXZvJyk7XG4vLyBTY3JpcHRzXFxIdWV2by5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gV2hlbiB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgZWdnIGFuZCBtYWluIGNoYXJhY3RlciBpcyBsZXNzIHRoYW4gdGhpcyB2YWx1ZSwgY29sbGVjdGlvbiBvZiB0aGUgcG9pbnQgd2lsbCBiZSBjb21wbGV0ZWRcbiAgICAgICAgLy8gQ3VhbmRvIGxhIGRpc3RhbmNpYSBlbnRyZSBsYSBodWV2byB5IGVsIHBlcnNvbmFqZSBwcmluY2lwYWwgZXMgbWVub3IgcXVlIGVzdGUgdmFsb3IsIGxhIHJlY29waWxhY2nDs24gZGVsIHB1bnRvIHNlIGNvbXBsZXRhcsOhXG4gICAgICAgIHBpY2tSYWRpdXM6IDBcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fVxufSk7XG4vKlxyXG5nZXRQbGF5ZXJEaXN0YW5jZTogZnVuY3Rpb24gKCkge1xyXG4gICAgLy8g5qC55o2uIHBsYXllciDoioLngrnkvY3nva7liKTmlq3ot53nprtcclxuICAgIHZhciBwbGF5ZXJQb3MgPSB0aGlzLmdhbWUucGxheWVyLmdldFBvc2l0aW9uKCk7XHJcbiAgICAvLyDmoLnmja7kuKTngrnkvY3nva7orqHnrpfkuKTngrnkuYvpl7Tot53nprtcclxuICAgIHZhciBkaXN0ID0gY2MucERpc3RhbmNlKHRoaXMubm9kZS5wb3NpdGlvbiwgcGxheWVyUG9zKTtcclxuICAgIHJldHVybiBkaXN0O1xyXG59LFxyXG4gIG9uUGlja2VkOiBmdW5jdGlvbigpIHtcclxuICAgIC8vIOW9k+aYn+aYn+iiq+aUtumbhuaXtu+8jOiwg+eUqCBHYW1lIOiEmuacrOS4reeahOaOpeWPo++8jOeUn+aIkOS4gOS4quaWsOeahOaYn+aYn1xyXG4gICAgdGhpcy5nYW1lLnNwYXduTmV3U3RhcigpO1xyXG4gICAgLy8g6LCD55SoIEdhbWUg6ISa5pys55qE5b6X5YiG5pa55rOVXHJcbiAgICB0aGlzLmdhbWUuZ2FpblNjb3JlKCk7XHJcbiAgICAvLyDnhLblkI7plIDmr4HlvZPliY3mmJ/mmJ/oioLngrlcclxuICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XHJcbn0sXHJcbiAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lXHJcbnVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAvLyDmr4/luKfliKTmlq3lkozkuLvop5LkuYvpl7TnmoTot53nprvmmK/lkKblsI/kuo7mlLbpm4bot53nprtcclxuICAgIGlmICh0aGlzLmdldFBsYXllckRpc3RhbmNlKCkgPCB0aGlzLnBpY2tSYWRpdXMpIHtcclxuICAgICAgICAvLyDosIPnlKjmlLbpm4booYzkuLpcclxuICAgICAgICB0aGlzLm9uUGlja2VkKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8g5qC55o2uIEdhbWUg6ISa5pys5Lit55qE6K6h5pe25Zmo5pu05paw5pif5pif55qE6YCP5piO5bqmXHJcbiAgICB2YXIgb3BhY2l0eVJhdGlvID0gMSAtIHRoaXMuZ2FtZS50aW1lci90aGlzLmdhbWUuc3RhckR1cmF0aW9uO1xyXG4gICAgdmFyIG1pbk9wYWNpdHkgPSA1MDtcclxuICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gbWluT3BhY2l0eSArIE1hdGguZmxvb3Iob3BhY2l0eVJhdGlvICogKDI1NSAtIG1pbk9wYWNpdHkpKTtcclxufSxcclxuKi9cblxuY2MuX1JGcG9wKCk7Il19
