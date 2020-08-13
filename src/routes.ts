import express from 'express'

import ClassesController from './controllers/ClassesController'

const routes = express.Router()
const classesController = new ClassesController /* intancia com as informações do controller */

routes.post('/classes', classesController.create)
routes.get('/classes', classesController.index)


export default routes