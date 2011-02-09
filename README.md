Impact Box2D Plugin
==========

#### Box2D Physics Plugin for the Impact Game Engine ####

This plugin provides easy integration of Box2D into the [Impact Game Engine](http://impactjs.com/).


### Demo ###

[Jetpack Physics Demo](http://impactjs.com/demos/physics/)



### Usage ###

Copy the box2d directory into your `lib/plugins/` directory and require the `plugins.box2d.entity` and `plugins.box2d.game` files. Subclass your game from `ig.Box2DGame` and your entities from `ig.Box2DEntity`:

	MyGame = ig.Box2DGame.extend({
		…
	});


	// Subclassing ig.Box2DEntity instead of ig.Entity inherits
	// everything needed for the physics simulation
	EntityCrate = ig.Box2DEntity.extend({
		size: {x: 8, y: 8},
		
		// Collision is already handled by Box2D!
		collides: ig.Entity.COLLIDES.NEVER,
		
		animSheet: new ig.AnimationSheet( 'media/crate.png', 8, 8 ),
		
		init: function( x, y, settings ) {
			this.addAnim( 'idle', 1, [0] );
			this.parent( x, y, settings );
		}
	});


See the [Physics with Box2D article](http://impactjs.com/documentation/physics-with-box2d) for more info.