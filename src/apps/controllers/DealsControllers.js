import update_routine from '../../utils/update_routine'
import Deals from '../models/Deals'

class DealsController {

    async Index(req, res) {
        try {
            await update_routine.exec()
            var deals = await Deals.aggregate([
                {
                    $sort: {
                        _id: -1
                    },
                },
                {
                    $project: {
                        numero_bling: '$numero_bling',
                        id_pipedrive: '$id_pipedrive',
                        value: '$value',
                        org_name: '$org_name',
                        title: '$title',
                        date: { $dateToString: { format: '%d/%m/%Y', date: '$won_time' } },
                    },
                },
                {
                    $group: {
                        _id: '$date',
                        deals: {
                            $push: '$$ROOT',
                        },
                    },
                },

            ])
            return res.status(200).json(deals)
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ 'error': 'Internal server error' })
        }
    }

    async reportPerDay(req, res) {
        try {
            await update_routine.exec()

            var deals = await Deals.aggregate([
                {
                    $group: {
                        _id: { $dateToString: { format: '%d/%m/%Y', date: '$won_time' } },
                        total_value: { '$sum': '$value' }
                    }
                },
                {
                    $sort: {
                        _id: -1,
                        value: -1
                    },
                }
            ])
            return res.status(200).json(deals)
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ 'error': 'Internal server error' })
        }
    }
}

export default new DealsController();