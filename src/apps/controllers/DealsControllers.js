import api from '../../utils/pipedriveApi'
import { response } from 'express';
import update_routine from '../../utils/update_routine'
class DealsController{

    async Index(req,res){
        try{
            await update_routine.exec()
            response = await api.get('/deals')
            // console.log(response.data)
            
            return res.json(response.data)
            
        }catch(err){
            console.log(err)
        }
    }
}

export default new DealsController();