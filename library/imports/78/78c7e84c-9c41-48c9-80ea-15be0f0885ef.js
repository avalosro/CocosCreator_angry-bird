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