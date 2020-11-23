import {mailer} from '../core/mailer'


export const sendEmail = ({ emailFrom, emailTo, subject, html } ) => {
    mailer.sendMail(
        {
            from: emailFrom,
            to: emailTo,
            subject: subject,
            html: html,
        },
        function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }
        },
    );
};
