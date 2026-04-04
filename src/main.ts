import "./style.css";
import { config, scene } from './config/config';
import { animate } from './config/animate';
import { controls } from './config/controls';
import { TornadoParticles, ExplosionParticles } from './primitives/geometry';

const main = () => {
    config();
    TornadoParticles('Tornado');
    ExplosionParticles('Explosion');
    controls();
    animate(0);
};

main();