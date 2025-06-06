import { Router } from 'express';
import chatcontroles from '../controllers/chatcontroles.js';

const router = new Router();

router.get('/', chatcontroles.obtenerHistorial);
router.post('/religioso', chatcontroles.responderReligioso);
router.post('/filosofa', chatcontroles.responderFilosofa);
router.delete('/', chatcontroles.limpiarHistorial);
router.get('/exportar', chatcontroles.exportarPDF);

export default router;
