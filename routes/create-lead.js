export const createLead = (req,res) => {
    // console.log(req.phoneNo);
    const phoneNo = req.phoneNo;
    return res.status(200).send('Just for checking');
};