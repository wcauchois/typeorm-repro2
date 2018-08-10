import 'reflect-metadata';
import { createConnection } from 'typeorm';
import Gizmo from './entity/Gizmo';
import Gadget from './entity/Gadget';

async function run(caseNo: number) {
  const conn = await createConnection({
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    database: 'ormtest',
    entities: [Gizmo, Gadget],
    synchronize: true,
    dropSchema: true,
    logging: false
  });

  const gizmo1 = new Gizmo();
  const gizmo2 = new Gizmo();
  await Gizmo.save([gizmo1, gizmo2]);

  let gadget = new Gadget();
  gadget.gizmo = Promise.resolve(gizmo1);
  await gadget.save();

  console.log(`============================== CASE ${caseNo} ==============================`)
  switch (caseNo) {
  case 1:
    // Case #1: Setting gizmo via the Promise accessor nulls it out.
    gadget = (await Gadget.findOne(gadget.id))!;
    gadget.gizmo = Promise.resolve(gizmo2);
    await gadget.save();

    gadget = (await Gadget.findOne(gadget.id))!;
    // Outputs "undefined"
    console.log('Gizmo is', (await gadget.gizmo));
    break;
  case 2:
    // Case #2: Setting gizmo via the ID *does* work.
    gadget = (await Gadget.findOne(gadget.id))!;
    gadget.gizmoId = gizmo2.id;
    await gadget.save();

    gadget = (await Gadget.findOne(gadget.id))!;
    // Outputs { id: 2 }
    console.log('Gizmo is', (await gadget.gizmo));
    break;
  case 3:
    // Case #3: If you access the Promise (causing the result to get cached on the Entity),
    // and then set via the ID accessor, it doesn't actually change the FK.
    gadget = (await Gadget.findOne(gadget.id))!;
    await gadget.gizmo;
    gadget.gizmoId = gizmo2.id;
    await gadget.save();

    gadget = (await Gadget.findOne(gadget.id))!;
    // Outputs { id: 1 }. Gizmo was not changed.
    console.log('Gizmo is', (await gadget.gizmo));
    break;
  case 4:
    // Case #4: If you access the Promise and then set the Promise, it nulls out the FK.
    gadget = (await Gadget.findOne(gadget.id))!;
    await gadget.gizmo;
    gadget.gizmo = Promise.resolve(gizmo2);
    await gadget.save();

    gadget = (await Gadget.findOne(gadget.id))!;
    // Outputs undefined.
    console.log('Gizmo is', (await gadget.gizmo));
    break;
  }

  await conn.close();
}

async function runAll() {
  await run(1);
  await run(2);
  await run(3);
  await run(4);
}

runAll()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1)
  });
