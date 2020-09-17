import apiPip from './pipedriveApi'
import apiBling from './blingApi'
import Deals from '../apps/models/Deals'
import Register from '../apps/models/Register'
import { format, isAfter, addMonths } from 'date-fns';
import convertXml from './ConvertDealsXml'
import { date } from 'yup';

class UpdateRoutine {
    clean_data(data = []) {
        const formated_data = []
        for (const item of data) {
            var { id, won_time, title, value, org_name } = item
            formated_data.push({
                id_pipedrive: id,
                won_time,
                title,
                value,
                org_name
            })
        }
        return formated_data
    }
    async extractor(update_time = new Date()) {
        var register = await Register.findOne().sort({ _id: -1 })
        var formated_data = []
        if (register) {
            var last_start_date = register.update_time
            var data_extract = []
            while (isAfter(update_time, last_start_date)) {
                url_data = `/deals/timeline?start_date=${format(last_start_date, "yyyy-MM-dd HH:mm:ss")}&interval=quarter&amount=1&field_key=won_time&filter_id=2`
                var response = await apiPip.get(url_data)
                var { data, status } = response
                console.log(status)
                console.log(data)
                if (status != 200) break
                data_extract = [...data.data[0].deals,...data_extract]
                last_start_date= addMonths(last_start_date,3)
            }
            formated_data = this.clean_data(data_extract)
            return formated_data
        }
        var start_page = 0
        var url_data = `/deals?filter_id=2&limit=500`
        var has_next = true
        var get_data = []
        while (has_next) {
            url_data = `/deals?filter_id=2&limit=500&start=${start_page}`
            var response = await apiPip.get(url_data)
            if (response.status != 200) break
            var { data, additional_data } = response.data
            get_data = [...data, ...get_data]
            has_next = additional_data.pagination.more_items_in_collection
            if (has_next) start_page += 500
        }
        formated_data = this.clean_data(get_data)
        return formated_data
    }
    async loader(data = []) {
        var xml = ''
        var count = 0
        for (const item of data) {
            xml = convertXml(item)
            var response = await apiBling.post(`pedido/json/?xml=${xml}`)
            if (response.status == 201) {
                var { numero, idPedido } = response.data.retorno.pedidos[0]
                var deal = await Deals.create({ ...item, numero_bling: numero, id_bling: idPedido })
                console.log(deal)
                count++
            }
        }
        return count
    }
    async exec() {
       try{ 
        var update_time = new Date()
        var data_extract = await this.extractor(update_time)
        var count = await this.loader(data_extract)
        await Register.create({ count, update_time })
    }
        catch(err){
            console.log(err)
        }
    }
}
export default new UpdateRoutine()