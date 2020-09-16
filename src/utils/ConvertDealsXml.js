import {format, parseISO} from 'date-fns'
import jsonxml from 'jsontoxml'
export default function convert(deal){
    const xmlObject = jsonxml(
        {
          pedido: [
            {
                name: 'pedido',
                children: [
                  { name: 'data', text: format(parseISO(deal.won_time),"dd/MM/yyyy") },
                ],
              },
            {
              name: 'cliente',
              children: [
                { name: 'nome', text: deal.org_name || 'Empresa não informada' },
              ],
            },
            {
              name: 'volumes',
              children: [
                {
                  name: 'volume',
                  children: [{ name: 'servico', text: 'Pipedrive-deals' }],
                },
              ],
            },
            {
              name: 'itens',
              children: [
                {
                  name: 'item',
                  children: [
                    { name: 'descricao', text: 'Pipedrive-deals' },
                    {name: 'codigo', text: deal.id_pipedrive},
                    { name: 'qtde', text: 1 },
                    { name: 'vlr_unit', text: deal.value || 0 },
                  ],
                },
              ],
            },
            {
              name: 'parcelas',
              children: [
                {
                  name: 'parcela',
                  children: [{ name: 'vlr', text: deal.value || 0 }],
                },
              ],
            },
          ],
        },
        false 
      );
        return xmlObject
}