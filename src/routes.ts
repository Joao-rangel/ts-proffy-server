import express from 'express';
import db from './database/connection';
import convertHourToMinutes from './utils/convertHourToMinutes';

const routes = express.Router()

interface ScheduleItem { /* define o formato esperado da hash schedule */
  week_day: number,
  from: string,
  to: string,
}

routes.post('/classes', async (request, response) => {
  const { /* desestruturação - chama cada variável do json */
    name,
    avatar,
    whatsapp,
    bio,
    subject,
    cost,
    schedule
  } = request.body /* request, input dada no json */

  const trx = await db.transaction() /* usar transaction garante que as alterações aconteção ao mesmo tempo no db. Em caso de erro, todas as alterações são revertidas  */

  try {
    const insertedUserIds = await trx('users').insert({ /* imprimir na tabela users */
      name, /* var = coluna, o nome por ser excluído */
      avatar, /* ex.: avatar: avatar */
      whatsapp,
      bio
    })
    
    const user_id = insertedUserIds[0] /* pegando id, pos [0] é pois podem ser passados vários usuários de uma vez no json */

    const insertedClassesId =  await trx('classes').insert({
      subject,
      cost,
      user_id
    })

    const class_id = insertedClassesId[0]

    const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
      return {
        class_id,
        week_day: scheduleItem.week_day,
        from: convertHourToMinutes(scheduleItem.from),
        to: convertHourToMinutes(scheduleItem.to) 
      }
    })

    await trx('class_schedule').insert(classSchedule) /* neste caso, a hash já está no formato certo para o banco de dados */

    await trx.commit(); /* aguarda a postagem de todas as transactions */

    return response.status(201).send() /* 201 = criado com sucesso */

  } catch (err) { /* captura o erro para retornar mensagem de erro */
    await trx.rollback() /* desfaz alterações no db em caso de erro */

    return response.status(400).json({
      error: 'Unexpected error while creating new class'
    })
  }

})

export default routes