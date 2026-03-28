import "./style.css";
import { config, scene } from './config/config';
import { animate } from './config/animate';
import { controls } from './config/controls';
import { TornadoParticles } from './primitives/geometry';

const main = () => {
    config();
    TornadoParticles('Tornado');
    controls();
    animate(0);
};

main();