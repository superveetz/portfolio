(function () {
  "use strict";

  angular.module('particle.canvas', [])

    .service('CanvasSystem', ['CanvasParticles', 'ParticleCollisions', function (CanvasParticles, ParticleCollisions) {
      var canvas;
      var ctx;
      var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame;
      var cancelAnimationFrame = window.cancelAnimationFrame ||
          window.mozCancelAnimationFrame ||
          window.webkitCancelAnimationFrame ||
          window.oCancelAnimationFrame ||
          window.msCancelAnimationFrame;
      var animationFrameId;

      return {
        getCanvas: function () {
          return canvas;
        },

        setCanvas: function (canvasElem) {
          canvas = canvasElem;
          ctx = canvas.getContext('2d');
        },

        startAnimation: function () {
          function render () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            var particles = CanvasParticles.getParticles();
            var p;

            for (var i = 0; i < particles.length; i++) {
              p = particles[i];
              p.draw();
              p.update();
              p.compareOtherParticles();
              p.drawCollisionEffect();
            }

            ParticleCollisions.setPrevCollisions(ParticleCollisions.getCollisions());
            ParticleCollisions.resetCollisions();

            animationFrameId = requestAnimationFrame(render, canvas);
          }

          render();
        },

        stopAnimation: function () {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = undefined;
          }
        }
      };

    }])

    .service('CanvasInit', ['$q', 'CanvasParticles', 'Particle', 'CanvasSystem', function ($q, CanvasParticles, Particle, CanvasSystem) {
      return {
        createParticles: function () {
          var canvas = CanvasSystem.getCanvas();
          var numParticles;

          if (canvas.width >= 1025) {
            numParticles = 150;
          } else if (canvas.width >= 600) {
            numParticles = 100;
          } else {
            numParticles = 50;
          }

          var intervalId = setInterval(function () {
            var canvas = CanvasSystem.getCanvas();
            var randomEdge = Math.random();
            var x;
            var y;
            var vx;
            var vy;

            if (randomEdge > 0.75) {
              // left
              x = 0;
              y = Math.random() * canvas.height;
              vx = Math.random() * 3;
              vy = (Math.random() - 0.5) * 6;
            } else if (randomEdge > 0.5) {
              // top
              x = Math.random() * canvas.width;
              y = 0;
              vx = (Math.random() - 0.5) * 6;
              vy = Math.random() * 3;
            } else if (randomEdge > 0.25) {
              // right
              x = canvas.width;
              y = Math.random() * canvas.height;
              vx = Math.random() * -3;
              vy = (Math.random() - 0.5) * 6;
            } else {
              // bottom
              x = Math.random() * canvas.width;
              y = canvas.height;
              vx = (Math.random() - 0.5) * 6;
              vy = Math.random() * -3;
            }

            CanvasParticles.addParticle(Particle.create({
              x: x,
              y: y,
              vx: vx,
              vy: vy,
              mass: 5
            }));

            if (CanvasParticles.getParticles().length  >= numParticles) {
              clearInterval(intervalId);
            }

          }, 50);

        }
      };
    }])

    .service('CanvasUtils', [function () {
      var utils = {
        rgbaFromObject: function (colorObj) {
          return 'rgba(' + colorObj.r + ', ' + colorObj.g + ', ' + colorObj.b + ', ' + 1 + ')';
        },

        distance: function (p0, p1) {
          var dx = p1.x - p0.x,
            dy = p1.y - p0.y;

          return Math.sqrt(dx * dx + dy * dy);
        },

        distanceXY: function (x0, y0, x1, y1) {
          var dx = x1 - x0,
            dy = y1 - y0;

          return Math.sqrt(dx * dx + dy * dy);
        },

        circleCollision: function (c0, c1) {
          return utils.distance(c0, c1) <= c0.pulseRadius + c1.pulseRadius;
        }
      };

      return utils;
    }])

    .service('ParticleCollisions', [function () {
      var collisions = [];
      var prevCollisions = [];

      return {
        getCollisions: function () {
          return collisions;
        },

        setCollision: function (pId) {
          collisions.push(pId);
        },

        resetCollisions: function () {
          collisions = [];
        },

        getPrevCollisions: function () {
          return prevCollisions;
        },

        setPrevCollisions: function (colArray) {
          prevCollisions = colArray;
        }

      };

    }])

    .service('CanvasParticles', [function () {
      var particles = [];

      return {
        addParticle: function (p) {
          particles.push(p);
        },

        getParticles: function () {
          return particles;
        }
      };

    }])

    .service('Particle', ['$window', 'ParticleCollisions', 'CanvasSystem', 'CanvasUtils', 'CanvasParticles', function ($window, ParticleCollisions, CanvasSystem, CanvasUtils, CanvasParticles) {
      var id = 0;

      var colors = [
        {
          r: 255,
          g: 76,
          b: 254
        },
        {
          r: 106,
          g: 207,
          b: 100
        },
        {
          r: 166,
          g: 228,
          b: 255
        },
        {
          r: 255,
          g: 241,
          b: 132
        }
      ];

      var particle = {
        create: function (newParticle) {
          var obj = Object.create(this);
          obj.id = id;
          id++;

          obj.x = newParticle.x;
          obj.y = newParticle.y;
          obj.vx = newParticle.vx;
          obj.vy = newParticle.vy;
          obj.mass = newParticle.mass;
          obj.radius = newParticle.mass;
          obj.pulseRadius = newParticle.mass;
          obj.scale = Math.random() * (Math.PI * 2);
          obj.fillStyle = newParticle.fillStyle || colors[Math.floor(Math.random() * colors.length)];

          return obj;
        },

        draw: function () {
          if (this.exploding) {
            this.drawExplosion();
          } else {
            this.drawNormal();
          }
        },

        drawExplosion: function () {
          var ctx = CanvasSystem.getCanvas().getContext('2d');

          this.collideEffect = true;
          this.explosionFill = this.explosionFill || Object.create(this.fillStyle);
          this.explosionFill.r = this.explosionFill.r == 255 ? 255 : this.explosionFill.r + 1;
          this.explosionFill.g = this.explosionFill.g == 255 ? 255 : this.explosionFill.g + 1;
          this.explosionFill.b = this.explosionFill.b == 255 ? 255 : this.explosionFill.b + 1;

          var innerRadius = this.pulseRadius * 0.0005;

          ctx.beginPath();
          ctx.arc(this.x, this.y, this.pulseRadius, 0, Math.PI * 2, false);

          // hack as gradient not supported on android
          if ($window.innerWidth <= 768) {
            ctx.fillStyle = CanvasUtils.rgbaFromObject(this.fillStyle);
          } else {
            var gradient = ctx.createRadialGradient(this.x, this.y, innerRadius, this.x, this.y, this.pulseRadius);
            gradient.addColorStop(0, "white");
            gradient.addColorStop(1, CanvasUtils.rgbaFromObject(this.explosionFill));
            ctx.fillStyle = gradient;
          }

          ctx.fill();
        },

        drawNormal: function () {
          var ctx = CanvasSystem.getCanvas().getContext('2d');
          var innerRadius = this.pulseRadius * 0.0005;

          ctx.beginPath();
          ctx.arc(this.x, this.y, this.pulseRadius, 0, Math.PI * 2, false);

          // hack as gradient not supported on android
          if ($window.innerWidth <= 768) {
            ctx.fillStyle = CanvasUtils.rgbaFromObject(this.fillStyle);
          } else {
            var gradient = ctx.createRadialGradient(this.x, this.y, innerRadius, this.x, this.y, this.pulseRadius);
            gradient.addColorStop(0, "white");
            gradient.addColorStop(1, CanvasUtils.rgbaFromObject(this.fillStyle));
            ctx.fillStyle = gradient;
          }
          ctx.fill();
        },

        update: function () {
          var canvas = CanvasSystem.getCanvas();

          if (!this.exploding) {
            this.scale += 0.05;
            this.pulseRadius = this.radius + (Math.cos(this.scale) * 2);

            this.x += this.vx;
            this.y += this.vy;

            if (this.vx > 0 && this.vx < 0.5) {
              this.vx += 0.1;
            } else if (this.vx < 0 && this.vx > -0.5) {
              this.vx -= 0.1;
            }

            if (this.vy > 0 && this.vy < 0.5) {
              this.vy += 0.1;
            } else if (this.vy < 0 && this.vy > -0.5) {
              this.vy -= 0.1;
            }

            // edge handling
            if (this.x - this.radius < 0) {
              this.vx *= -1;
              this.x = 0 + this.radius;
            }

            if (this.x + this.radius > canvas.width) {
              this.vx *= -1;
              this.x = canvas.width - this.radius;
            }

            if (this.y - this.radius < 0) {
              this.vy *= -1;
              this.y = 0 + this.radius;
            }

            if (this.y + this.radius > canvas.height) {
              this.vy *= -1;
              this.y = canvas.height - this.radius;
            }
          } else {
            this.vx = 0;
            this.vy = 0;

            var particles = CanvasParticles.getParticles();

            if (this.explosionFill.r == 255 && this.explosionFill.g == 255 && this.explosionFill.b == 255) {
              var maxV = 5;
              var angle = 0;
              var numNewParticles = Math.round(this.mass / 5);
              var angleInc = 360 / numNewParticles;

              for (var i = 0; i < particles.length; i++) {
                if (this.id == particles[i].id) {
                  particles.splice(i, 1);
                  break;
                }
              }

              for (var i = 0; i < numNewParticles; i++) {
                particles.push(particle.create({
                  x: this.x + this.pulseRadius / 2 * Math.cos(angle),
                  y: this.y + this.pulseRadius  / 2 * Math.sin(angle),
                  vx: Math.cos(angle) * maxV,
                  vy: Math.sin(angle) * maxV,
                  fillStyle: this.fillStyle,
                  mass: 5
                }));


                angle += angleInc * (Math.PI / 180);
              }

              delete this;
            }
          }
        },

        compareOtherParticles: function () {
          var particle;
          var particles = CanvasParticles.getParticles();

          for (var i = 0; i < particles.length; i++) {
            particle = particles[i];
            this.checkForCollisions(particle);
            this.connectParticles(particle);
          }
        },

        drawCollisionEffect: function () {
          var ctx = CanvasSystem.getCanvas().getContext('2d');

          if (this.collideEffect) {
            this.collideEffectRadius = this.collideEffectRadius || this.pulseRadius;

            this.collideEffectRadius += 0.4;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.collideEffectRadius, 0, Math.PI * 2, false);
            ctx.lineWidth = 1;
            ctx.strokeStyle = CanvasUtils.rgbaFromObject(this.fillStyle);
            ctx.stroke();
            ctx.lineWidth = 1;

            if (this.collideEffectRadius >= this.pulseRadius + 15) {
              this.collideEffectRadius = undefined;
              this.collideEffect = false;
            }
          }
        },

        connectParticles: function (particle) {
          var ctx = CanvasSystem.getCanvas().getContext('2d');

          if (CanvasUtils.rgbaFromObject(this.fillStyle) == CanvasUtils.rgbaFromObject(particle.fillStyle)
            && CanvasUtils.distance(this, particle) < 100) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(particle.x, particle.y);
            ctx.strokeStyle = CanvasUtils.rgbaFromObject(this.fillStyle);
            ctx.stroke();
          }
        },

        consumeParticle: function (particle) {
          var f1x = this.mass * this.vx;
          var f2x = particle.mass * particle.vx;
          var f1y = this.mass * this.vy;
          var f2y = particle.mass * particle.vy;

          var larger = this.pulseRadius > particle.pulseRadius ? this : particle;
          this.x = larger.x;
          this.y = larger.y;
          this.mass = this.mass + particle.mass;
          this.radius = this.mass;
          this.pulseRadius = this.mass;

          if ((this.vx > 0 && particle.vx > 0 ) || (this.vx < 0 && particle.vx < 0)) {
            this.vx = (f1x + f2x) / this.mass;
          } else {
            this.vx = (Math.max(f1x, f2x) - Math.min(f1x, f2x)) / this.mass;
          }

          if ((this.vy > 0 && particle.vy > 0) || (this.vy < 0 && particle.vy < 0)) {
            this.vy = (f1y + f2y) / this.mass;
          } else {
            this.vy = (Math.max(f1y, f2y) - Math.min(f1y, f2y)) / this.mass;
          }

          if (this.mass >= 35) {
            this.exploding = true;
          }
        },

        checkForCollisions: function (particle) {
          var particles = CanvasParticles.getParticles();
          var collisions = ParticleCollisions.getCollisions();

          var collisionRecorded = collisions.indexOf(this.id);

          if (collisionRecorded != -1) return;

          if (particle.id != this.id && CanvasUtils.circleCollision(this, particle)) {

            if (_.isEqual(particle.fillStyle, this.fillStyle) && !particle.exploding && !this.exploding) {
              var distance = CanvasUtils.distanceXY(this.x, this.y, particle.x, particle.y);
              if (distance <= Math.max(this.pulseRadius, particle.pulseRadius)) {
                this.consumeParticle(particle);
                particles.splice(particles.indexOf(particle), 1);
                return;
              }
            } else {
              this.performCollision(this, particle);
            }

          }
        },

        performCollision: function (p1, p2) {
          var prevCollisions = ParticleCollisions.getPrevCollisions();
          var collisions = ParticleCollisions.getCollisions();

          var particle1Stuck = prevCollisions.indexOf(p1.id);
          var particle2Stuck = prevCollisions.indexOf(p2.id);

          if (particle1Stuck != -1 && particle2Stuck != -1) {
            var right = p1.x >= p2.x ? p1 : p2;
            var left = p1.x < p2.x ? p1 : p2;
            var top = p1.y >= p2.y ? p1 : p2;
            var bottom = p1.y < p2.y ? p1 : p2;

            right.vx = 1;
            left.vx = -1;
            bottom.vy = 1;
            top.vy = -1;
            return;
          }

          collisions.push(p1.id);
          collisions.push(p2.id);
          p2.collideEffect = true;
          p1.collideEffect = true;

          var f1x = p1.vx * p1.mass;
          var f2x = p2.vx * p2.mass;
          var lrgFx = Math.max(f1x, f2x);
          var smlFx = Math.min(f1x, f2x);
          var dFx = lrgFx - smlFx;

          if (f1x >= f2x) {
            // f1x is lrg
            f1x -= dFx;
            f2x += dFx;
          } else {
            // f1x is sml
            f1x += dFx;
            f2x -= dFx;
          }


          p1.vx = f1x / p1.mass;
          p2.vx = f2x / p1.mass;

          var f1y = p1.vy * p1.mass;
          var f2y = p2.vy * p2.mass;
          var lrgFy = Math.max(f1y, f2y);
          var smlFy = Math.min(f1y, f2y);
          var dFy = lrgFy - smlFy;

          if (f1y >= f2y) {
            // f1x is lrg
            f1y -= dFy;
            f2y += dFy;
          } else {
            // f1x is sml
            f1y += dFy;
            f2y -= dFy;
          }


          p1.vy = f1y / p1.mass;
          p2.vy = f2y / p1.mass;

          if (p1.vx > 3) {
            p1.vx = 3;
          } else if (p1.vx < -3) {
            p1.vx = 3;
          }

          if (p1.vy > 3) {
            p1.vy = 3;
          } else if (p1.vy < -3) {
            p1.vy = 3;
          }

          if (p2.vx > 3) {
            p2.vx = 3;
          } else if (p2.vx < -3) {
            p2.vx = 3;
          }

          if (p2.vy > 3) {
            p2.vy = 3;
          } else if (p2.vy < -3) {
            p2.vy = 3;
          }
        }
      };

      return particle;
    }])

    .directive('particleCanvas', ['$window', '$timeout', 'CanvasSystem', 'CanvasInit', 'FirstLoad', 'CanvasParticles', function ($window, $timeout, CanvasSystem, CanvasInit, FirstLoad, CanvasParticles) {
      return {
        link: function (scope, elem) {
          var window = angular.element($window);
          var canvas = elem[0];

          canvas.style.background = "black";

          if (FirstLoad.getFirstLoad()) {

            setTimeout(function () {
              CanvasSystem.setCanvas(elem[0]);

              canvas.width = canvas.parentElement.offsetWidth;
              canvas.height = canvas.parentElement.offsetHeight;

              CanvasInit.createParticles();

              CanvasSystem.startAnimation();
            }, 8000);

            setTimeout(function () {
              $('#cube').addClass('rotate-in');
            }, 9000);

          } else {
            CanvasSystem.setCanvas(elem[0]);
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;


            if (!CanvasParticles.getParticles().length) {
              $('#cube').addClass('rotate-in');
              CanvasInit.createParticles();
            }

            CanvasSystem.startAnimation();
          }

          window.on('resize', function () {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
          });

        }
      };
    }]);

})();
