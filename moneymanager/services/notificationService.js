import cron from 'node-cron';
import { Profile, Expense, Category } from '../models/index.js';
import { sendEmail } from './emailService.js';
import dotenv from 'dotenv';

dotenv.config();

const frontendUrl = process.env.SPENDWISE_FRONTEND_URL || process.env.MONEY_MANAGER_FRONTEND_URL || 'http://localhost:5173';

export const initScheduledJobs = () => {
  // 10 PM IST Daily Reminder
  cron.schedule('0 22 * * *', async () => {
    console.log('Job started: sendDailyIncomeExpenseReminder()');
    try {
      const profiles = await Profile.findAll();
      for (const profile of profiles) {
        const body = `Hi ${profile.fullName},<br><br>`
          + `This is a friendly reminder to add your income and expenses for today in SpendWise.<br><br>`
          + `<a href="${frontendUrl}" style="display:inline-block;padding:10px 20px;background-color:#9333ea;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">Go to SpendWise</a>`
          + `<br><br>Best regards,<br>SpendWise Team`;

        await sendEmail(profile.email, 'Daily reminder: Add your income and expenses in SpendWise', body);
      }
      console.log('Job completed: sendDailyIncomeExpenseReminder()');
    } catch (error) {
      console.error('Error in sendDailyIncomeExpenseReminder cron job:', error);
    }
  }, {
    timezone: 'Asia/Kolkata'
  });

  // 11 PM IST Daily Expense Summary
  cron.schedule('0 23 * * *', async () => {
    console.log('Job started: sendDailyExpenseSummary()');
    try {
      const profiles = await Profile.findAll();
      const today = new Date().toISOString().split('T')[0];

      for (const profile of profiles) {
        const todaysExpenses = await Expense.findAll({
          where: {
            profile_id: profile.id,
            date: today
          },
          include: [{ model: Category, attributes: ['name'] }]
        });

        if (todaysExpenses && todaysExpenses.length > 0) {
          let table = "<table style='border-collapse:collapse;width:100%;'>";
          table += "<tr style='background-color:#f2f2f2;'><th style='border:1px solid #ddd;padding:8px;'>S.No</th><th style='border:1px solid #ddd;padding:8px;'>Name</th><th style='border:1px solid #ddd;padding:8px;'>Amount</th><th style='border:1px solid #ddd;padding:8px;'>Category</th></tr>";

          todaysExpenses.forEach((expense, index) => {
            const catName = expense.tbl_category ? expense.tbl_category.name : 'N/A';
            table += "<tr>";
            table += `<td style='border:1px solid #ddd;padding:8px;'>${index + 1}</td>`;
            table += `<td style='border:1px solid #ddd;padding:8px;'>${expense.name}</td>`;
            table += `<td style='border:1px solid #ddd;padding:8px;'>${expense.amount}</td>`;
            table += `<td style='border:1px solid #ddd;padding:8px;'>${catName}</td>`;
            table += "</tr>";
          });

          table += "</table>";
          const body = `Hi ${profile.fullName},<br/><br/> Here is a summary of your expenses for today:<br/><br/>${table}<br/><br/>Best regards,<br/>SpendWise Team`;

          await sendEmail(profile.email, 'Your daily SpendWise expense summary', body);
        }
      }
      console.log('Job completed: sendDailyExpenseSummary()');
    } catch (error) {
      console.error('Error in sendDailyExpenseSummary cron job:', error);
    }
  }, {
    timezone: 'Asia/Kolkata'
  });
};
