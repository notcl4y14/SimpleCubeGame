let Player = (function(position, size, speed, color, controls) {
    this.position = position;
    this.size = size;
    this.speed = speed;
    this.color = color;
    this.controls = controls;
    
    //////////////////

    this.setPos = function(position) {
        this.position = position;
        return this;
    };

    this.setSize = function(size) {
        this.size = size;
        return this;
    };

    this.setSpeed = function(speed) {
        this.speed = speed;
        return this;
    };

    this.setColor = function(color) {
        this.color = color;
        return this;
    };

    this.setControls = function(controls) {
        this.controls = controls;
        return this;
    };
    
    //////////////////

    this.update = function() {
        let dirX = (Input.isKeyDown(this.controls.right) - Input.isKeyDown(this.controls.left));
        let dirY = (Input.isKeyDown(this.controls.down) - Input.isKeyDown(this.controls.up));

        this.position.x += dirX * this.speed;
        this.position.y += dirY * this.speed;
    };

    this.render = function(ctx) {
        // let ctx = this.ctx;
        // let canvas = ctx.canvas;

        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );
    };
});

let World = (function(game, size) {
    this.objects = [];
    this.size = (size || 124);
    
    //////////////////

    this.add = function(obj) {
        if (this.objects.length >= this.size) {
            // Supposed to crash the game
            // this.stop();
            alert(`Object limit exceeded! (${this.objects.length}/${this.size})`);
            return;
        }

        this.objects.push(obj);
    };
    
    //////////////////

    this.update = function() {
        for (let obj of this.objects) {
            obj.update();
        }
    };

    this.render = function(ctx) {
        for (let obj of this.objects) {
            obj.render(ctx);
        }
    };
})

let Game = (function() {
    
    this.ctx = document.getElementById("canvas")
        .getContext("2d");
    this.running = false;

    this.options = {
        clear_color: "#000000",
    };

    this.world = new World();
    this.world.add(
        new Player()
            .setPos({x: 20, y: 20})
            .setSize({width: 40, height: 40})
            .setSpeed(4)
            .setColor("#ffffff")
            .setControls({
                left: "KeyA",
                right: "KeyD",
                up: "KeyW",
                down: "KeyS",
            })
    );

    this.delta = 0;
    this.last = 0;
    this.FPS = 0;
    
    //////////////////

    this.start = function() {
        this.running = true;
        window.requestAnimationFrame(() => this.loop.call(this));
    };

    this.stop = function() {
        this.running = false;
    };

    //////////////////

    this.loop = function() {

        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;

        this.update();
        this.render();
        
        this.delta = (performance.now() - this.last) / 1000;
        this.FPS = Math.floor(1 / this.delta);
        this.last = performance.now();

        window.requestAnimationFrame(() => this.loop.call(this));
    };
    
    //////////////////

    this.update = function() {
        this.world.update();
    };

    this.render = function() {
        let ctx = this.ctx;
        let canvas = ctx.canvas;

        this.clearScreen();
        this.world.render(ctx);
        this.renderFPS();
    };
    
    //////////////////

    this.clearScreen = function() {
        let ctx = this.ctx;
        let canvas = ctx.canvas;

        ctx.fillStyle = this.options.clear_color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    this.renderFPS = function() {
        let ctx = this.ctx;
        let canvas = ctx.canvas;

        ctx.fillStyle = "green";
        ctx.fillText("FPS: " + this.FPS, 0, 10);
    }
});

let game = {};
let Input = {};

window.onload = function() {
    Input = {
        keys: [],

        isKeyDown: function(key) {
            return this.keys[key] === true;
        },

        isKeyUp: function(key) {
            return this.keys[key] == false;
        },
    };

    game = new Game();
    game.start();
}

window.onkeydown = function(e) {
    Input.keys[e.code] = true;
}

window.onkeyup = function(e) {
    Input.keys[e.code] = false;
}