import { getDb } from "../../db.js";
import { getPeriodTimeStamp } from "../../helpers/utils.js";

// export const getActiveUsers = async (fromTimeStamp = 0, toTimeStamp =  Date.now()) => {
//   const db = await getDb();
//   return await db.collection('user').countDocuments({
//     'updatedAt': {
//       $gte: fromTimeStamp,
//       $lte: toTimeStamp
//     }
//   });
// }

// export const getLeadsGenerated = async (fromTimeStamp = 0, toTimeStamp =  Date.now()) => {
//   const db = await getDb();
//   return await db.collection('lead').countDocuments({
//     'createdAt': {
//       $lte: toTimeStamp,
//       $gte: fromTimeStamp
//     }
//   });
// }

export const fetchDashboard = async (req, res) => {
  const db = await getDb();
    
  let { startDate, endDate, specifiedPeriod } = req.body;
  let fromTimeStamp, toTimeStamp;
  
  if(startDate && endDate){
    fromTimeStamp = new Date(startDate).getTime();
    toTimeStamp = new Date(endDate).getTime();
  }else if(specifiedPeriod){
    fromTimeStamp = getPeriodTimeStamp(specifiedPeriod);
    toTimeStamp = Date.now();
  }else{
    fromTimeStamp = getPeriodTimeStamp('today');
    toTimeStamp = Date.now();
  }

  const [{totalUsers, activeUsers}] = await db.collection('user').aggregate(
    [
      { "$facet": {
        "totalUsers": [
          { "$match" : {}},
          { "$count": "Total" },
        ],
        "activeUsers": [
          { "$match" : {"updatedAt": { "$gte": fromTimeStamp, "$lte": toTimeStamp }}},
          { "$count": "Total" }
        ]
      }},
      { "$project": {
        "totalUsers": { "$arrayElemAt": ["$totalUsers.Total", 0] },
        "activeUsers": { "$arrayElemAt": ["$activeUsers.Total", 0] }
      }}
  ]).toArray();

  const [{totalLeadsGenerated=0, totalLeadsConverted=0, leadsGenerated=0, leadsConverted=0, totalBankAdded=0, totalWalletAdded=0 , bankAdded=0, walletAdded=0}] = await db.collection('lead').aggregate(
    [
      { "$facet": {
        "totalLeadsGenerated": [
          { "$match" : {}},
          { "$count": "Total" },
        ],
        "totalLeadsConverted": [
          { "$match" : {"status":{"$ne":"pending"}}},
          { "$count": "Total" },
        ],
        "totalBankAdded": [
          { "$match" : {"status":"bank_added"}},
          {
            "$group": {
              "_id": "status",
              "Total": { "$sum": "$payment.amount" },
          }
        }],
        "totalWalletAdded": [
          { "$match" : {"status":"wallet_added"}},
          {
            "$group": {
              "_id": "status",
              "Total": { "$sum": "$payment.amount" },
          }
        }],
        "leadsGenerated": [
          { "$match" : {"createdAt": { "$gte": fromTimeStamp, "$lte": toTimeStamp }}},
          { "$count": "Total" }
        ],
        "leadsConverted": [
          { "$match" : {"createdAt": { "$gte": fromTimeStamp, "$lte": toTimeStamp }}},
          { "$count": "Total" }
        ],
        "bankAdded": [
          { "$match" : {'$and': [{"status":"bank_added", "payment.paidDate": { "$gte": fromTimeStamp, "$lte": toTimeStamp }}]}},
          {
            "$group": {
              "_id": "status",
              "Total": { "$sum": "$payment.amount" },
          }
        }],
        "walletAdded": [
          { "$match" : {"status":"wallet_added", "payment.paidDate": { "$gte": fromTimeStamp, "$lte": toTimeStamp }}},
          {
            "$group": {
              "_id": "status",
              "Total": { "$sum": "$payment.amount" },
          }
        }],
      }},
      { "$project": {
        "totalLeadsGenerated": { "$arrayElemAt": ["$totalLeadsGenerated.Total", 0]},
        "totalLeadsConverted": { "$arrayElemAt": ["$totalLeadsConverted.Total", 0]},
        "totalBankAdded": { "$arrayElemAt": ["$totalBankAdded.Total", 0]},
        "totalWalletAdded": { "$arrayElemAt": ["$totalWalletAdded.Total", 0]},
        "leadsGenerated": { "$arrayElemAt": ["$leadsGenerated.Total", 0]},
        "leadsConverted": { "$arrayElemAt": ["$leadsConverted.Total", 0]},
        "bankAdded": { "$arrayElemAt": ["$bankAdded.Total", 0]},
        "walletAdded": { "$arrayElemAt": ["$walletAdded.Total", 0]},
      }}
    ]).toArray();

  return res.status(200).json({totalUsers, totalLeadsGenerated, totalLeadsConverted, activeUsers, leadsGenerated, leadsConverted, totalBankAdded, totalWalletAdded, bankAdded, walletAdded});
};
