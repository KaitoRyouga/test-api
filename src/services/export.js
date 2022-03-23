import exceljs from 'exceljs';
import moment from 'moment';
import fs from 'fs';

const exportExcel = async (ctx, data, fileName) => {

    const file = new exceljs.Workbook();
    await file.xlsx.readFile('./template/report-users.xlsx');
    const sheet = file.getWorksheet('users');

    data.forEach((item, index) => {
        sheet.addRow([
            index + 1,
            item.username,
            item.fullname,
            moment(item.birthdate).format('DD/MM/YYYY'),
            item.address
        ]);
    });

    await file.xlsx.writeFile(`./template/${fileName}.xlsx`);
    
    ctx.statusCode = 200;
    ctx.set('Content-Type', 'xlsx');
    ctx.set('Content-Disposition', `attachment; filename=${fileName}.xlsx`);
    ctx.body = fs.createReadStream(`./template/${fileName}.xlsx`);
    
}

export default exportExcel;