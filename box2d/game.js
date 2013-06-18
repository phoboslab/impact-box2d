ig.module( 
	'plugins.box2d.game'
)
.requires(
	'plugins.box2d.lib',
	'impact.game'
)
.defines(function(){
	
	
	
ig.Box2DGame = ig.Game.extend({
		
	collisionRects: [],
	debugCollisionRects: false,

	worldVelocityIterations: 6,
	worldPositionIterations: 6, 
	
	
	loadLevel: function( data ) {
		
		// Find the collision layer and create the box2d world from it
		for( var i = 0; i < data.layer.length; i++ ) {
			var ld = data.layer[i];
			if( ld.name == 'collision' ) {
				ig.world = this.createWorldFromMap( ld.data, ld.width, ld.height, ld.tilesize );
				break;
			}
		}
		
		this.parent( data );
	},
	
	
	createWorldFromMap: function( origData, width, height, tilesize ) {	
		var worldBoundingBox = new Box2D.Collision.b2AABB();
		worldBoundingBox.lowerBound.Set( 0, 0 );
		worldBoundingBox.upperBound.Set(
			(width + 1) * tilesize * Box2D.SCALE,
			(height + 1) * tilesize  * Box2D.SCALE
		);
		
		var gravity = new Box2D.Common.Math.b2Vec2( 0, this.gravity * Box2D.SCALE );
		world = new Box2D.Dynamics.b2World( gravity, true );
		
		
		// We need to delete those tiles that we already processed. The original
		// map data is copied, so we don't destroy the original.
		var data = ig.copy( origData );
		
		// Get all the Collision Rects from the map
		this.collisionRects = [];
		for( var y = 0; y < height; y++ ) {
			for( var x = 0; x < width; x++ ) {
				// If this tile is solid, find the rect of solid tiles starting
				// with this one
				if( data[y][x] ) {
					var r = this._extractRectFromMap( data, width, height, x, y );
					this.collisionRects.push( r );
				}
			}
		}
		
		// Go through all rects we gathered and create Box2D objects from them
		for( var i = 0; i < this.collisionRects.length; i++ ) {
			var rect = this.collisionRects[i];
			
			var bodyDef = new Box2D.Dynamics.b2BodyDef();
			bodyDef.position.Set(
				rect.x * tilesize * Box2D.SCALE + rect.width * tilesize / 2 * Box2D.SCALE,
				rect.y * tilesize * Box2D.SCALE + rect.height * tilesize / 2 * Box2D.SCALE
			);
			
			var body = world.CreateBody( bodyDef );
			var shape = new Box2D.Collision.Shapes.b2PolygonShape();
			shape.SetAsBox(
				rect.width * tilesize / 2 * Box2D.SCALE,
				rect.height * tilesize / 2 * Box2D.SCALE
			);
			body.CreateFixture2( shape );
		}
		
		return world;
	},
	
	
	_extractRectFromMap: function( data, width, height, x, y ) {
		var rect = {x: x, y: y, width: 1, height: 1};
		
		// Find the width of this rect
		for(var wx = x + 1; wx < width && data[y][wx]; wx++ ) {
			rect.width++;
			data[y][wx] = 0; // unset tile
		}
		
		// Check if the next row with the same width is also completely solid
		for( var wy = y + 1; wy < height; wy++ ) {
			var rowWidth = 0;
			for( wx = x; wx < x + rect.width && data[wy][wx]; wx++ ) {
				rowWidth++;
			}
			
			// Same width as the rect? -> All tiles are solid; increase height
			// of this rect
			if( rowWidth == rect.width ) {
				rect.height++;
				
				// Unset tile row from the map
				for( wx = x; wx < x + rect.width; wx++ ) {
					data[wy][wx] = 0;
				}
			}
			else {
				return rect;
			}
		}
		return rect;
	},
	
	
	update: function() {
		ig.world.Step(
			ig.system.tick,
			this.worldVelocityIterations,
			this.worldPositionIterations
		);
		ig.world.ClearForces();
		this.parent();
	},
	
	
	draw: function() {
		this.parent();
		
		if( this.debugCollisionRects ) {
			// Draw outlines of all collision rects
			var ts = this.collisionMap.tilesize;
			for( var i = 0; i < this.collisionRects.length; i++ ) {
				var rect = this.collisionRects[i];
				ig.system.context.strokeStyle = '#00ff00';
				ig.system.context.strokeRect(
					ig.system.getDrawPos( rect.x * ts - this.screen.x ),
					ig.system.getDrawPos( rect.y * ts - this.screen.y ),
					ig.system.getDrawPos( rect.width * ts ),
					ig.system.getDrawPos( rect.height * ts )
				);
			}
		}
	}
	
	
});
	
});

