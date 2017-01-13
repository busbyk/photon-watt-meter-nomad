const Nomad = require('nomad-stream');
const Particle = require('particle-api-js');
const _ = require('lodash');

const config = require('./../config/index');
const credentials = config.particle.credentials;
const deviceId = config.particle.deviceId;
// const events = ['Gas', 'UV', 'Movement'];

const particle = new Particle();
const nomad = new Nomad();

class ParticleListener {
  constructor() {
    this.instance = null;
    this.publishedRootMessage = false;
    this.token = null;
    this.stream = null;
    this.publish = null;

    this.startParticleListener();
    this.prepareNomad();

    this.timer = 0;
    setInterval(() => {
      this.timer += 5;
    }, 5000);

    this.deviceState;
  }

  startParticleListener() {
    particle.login(credentials).then(response => {
      this.token = response.body.access_token;
      console.log(`Got token: ${this.token}`);

      particle.getEventStream({ deviceId: deviceId, name: 'device_on_off', auth: this.token }).then(stream => {
        this.stream = stream;
        this.stream.on('event', data => {
          console.log(JSON.stringify(data));

          if(data.data !== this.deviceState || typeof this.deviceState == 'undefined') {
            this.deviceState = data.data;
            let message = {
              data: data.data,
              publishedAt: data.published_at,
              event: data.name
            };

            console.log('should publish to nomad')

            this.instance.publish(JSON.stringify(message)).then(() => {
              console.log('successfully published to nomad'); 
            }).catch(err => {
              console.log(`Error: ${err}`)
            });
          } else {
            this.deviceState = data.data;
          }
        });
      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });
  }

  prepareNomad() {
    nomad.prepareToPublish().then(n => {
      this.instance = n;

      this.instance.publishRoot("Tweet-a-watt photon meter").then(() => {
        this.publishedRootMessage = true;
      }).catch(err => {
        console.log(err);
      })
    }).catch(err => {
      console.log(err);
    });
  }
}



module.exports = ParticleListener;