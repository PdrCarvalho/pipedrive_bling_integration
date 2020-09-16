import apiPip from './pipedriveApi'
import apiBling from './blingApi'
import Deals from '../apps/models/Deals'
import Register from '../apps/models/Register'
import { format, parseISO } from 'date-fns';
import convertXml from './ConvertDealsXml'

class UpdateRoutine{
    clean_data(data=[]){
        const formated_data=[]
        for (const item of data){
            var{id, won_time, title, value, org_name} = item
            formated_data.push({
                id_pipedrive:id,
                won_time,
                title,
                value,
                org_name
            })
        }
        return formated_data
    }
    async extractor(){
        var register = await Register.findOne().sort({_id:-1})
        var formated_data=[]
        if (register) {
            // console.log(register)
            // 2020-07-20 00:01:00 format for pipedrive
            
            var last_update = format(register.update_time,"yyyy-MM-dd HH:mm:ss")
            url_data = `/deals/timeline?start_date=${last_update}&interval=quarter&amount=1&field_key=won_time&filter_id=2`
            var response = await apiPip.get(url_data)
            var {data,status} = response
            if (status!=200)return []
            data = data.data[0].deals
            formated_data= this.clean_data(data)
            return formated_data
        }
        var start_page= 0
        var url_data= `/deals?filter_id=2&limit=500`
        var has_next = true
        var get_data=[]
        while (has_next){
            url_data = `/deals?filter_id=2&limit=500&start=${start_page}`
            var response = await apiPip.get(url_data)
            // console.log(response.status)
            if (response.status!= 200) break
            var {data, additional_data}=response.data
            get_data=[...data,...get_data]
            has_next = additional_data.pagination.more_items_in_collection
            if (has_next)start_page+=500
        }
        // console.log(get_data)
        formated_data = this.clean_data(get_data)
        // console.log(formated_data)
        return formated_data
}
    async loader(data=[]){
        var xml =''
        var count = 0
        for (const item of data) {
            xml= convertXml(item)
            console.log(xml)
            var response = await apiBling.post(`pedido/json/?xml=${xml}`)
            console.log(response.status)
            console.log(response.data)
            if (response.status==201){
                var {numero, idPedido}= response.data.retorno.pedidos[0]
                var deal = await Deals.create({...item,numero_bling:numero,id_bling:idPedido})
                console.log(deal)
                count++
            }
        }
        return count
    }
    async exec(){
        var update_time = new Date()
        var data_extract = await this.extractor()
        console.log(data_extract)
        var count = await this.loader(data_extract)
        console.log(count)
        await Register.create({count,update_time})
    }
}
export default new UpdateRoutine()