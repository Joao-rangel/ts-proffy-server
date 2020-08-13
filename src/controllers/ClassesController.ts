import { Request, Response } from 'express' /* importo para puxar as opções do express (pq ele não foi usado) */

import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem { /* define o formato esperado da hash schedule */
  week_day: number,
  from: string,
  to: string,
}

export default class ClassesController {
  async index(request: Request, response: Response) { /* crinado filtro para pesquisa */
    const filters = request.query /* o filtro será um requisição query */

    const week_day = filters.week_day as string
    const time = filters.time as string
    const subject = filters.subject as string

    if (!filters.week_day || !filters.subject || !filters.time) { /* caso algum destes filtros não seja enviado */
      return response.status(400).json({ /* retorna o erro */
        error: 'Missing filters to search classes'
      })
    }

    const timeInMinuts = convertHourToMinutes(time) /* coleta as horas como string e converte em minutos */

    const classes = await db('classes')
      .whereExists(function () {
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`') /* os horários de aulas da matéria buscada */
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)]) /* dias da semana procurados */
          .whereRaw('`class_schedule`.`from` <= ??', [timeInMinuts])
          .whereRaw('`class_schedule`.`to` > ??', [timeInMinuts])
      })


      .where('classes.subject', '=', subject) /* filtra a matéria no db */
      .join('users', 'classes.user_id', '=', 'users.id') /* inner join 'juntando' as db */
      .select(['classes.*', 'users.*']) /* exibe todos os dados filtrados do db */

    return response.json(classes)
  }

  async create(request: Request, response: Response) { /* cria a classe controller para o db */
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
  }
}