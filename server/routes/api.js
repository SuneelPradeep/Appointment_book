
const express =require('express')
const router =express.Router()
const db = require('../models/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {authenticateToken,authorizeRole} = require('../middleware/auth')

router.get('/',(req,res)=>{
    res.json({message:'Hello from WoundTech!!'})
})

router.get('/clinicians',(req,res)=>{
    db.all(`SELECT * FROM clinicians`,[],(err,rows)=>{
        if(err) return res.status(500).json({error : err?.message})
        res.json(rows)
    })
})

//register api
router.post('/register',async(req,res)=>{
    const { username,password,role,name,speciality,date_of_birth}  =req.body
   
    if(!['clinician','patient'].includes(role)){
res.status(400).json({ error:'Invalid role'})
    }
    const hashedPassword = await bcrypt.hash(password,10)
    let ref_id;
    const dbInsert = (sql,params)=>
        new Promise((resolve,reject)=>{
            db.run(sql,params,function(err)
            {if(err) reject(err)
        else resolve(this.lastID)
    })
        })
    
        try {
            if(role==='clinician'){
                ref_id = await dbInsert('INSERT INTO clinicians (name,speciality) VALUES (?,?)',[name,speciality ||null])
            }
            else{
                ref_id = await dbInsert('INSERT INTO patients (name,dob) VALUES (?,?)',[name,date_of_birth || null])
            }

            await dbInsert('INSERT INTO users (username,password,role,ref_id) VALUES (?,?,?,?)',[username,hashedPassword,role,ref_id])
            res.json({message : 'User registered Successfully'})
        } catch (error) {
            console.error(error);
            
        }
})

//Login 
router.post('/login',(req,res)=>{
    const {username,password} = req.body;
  
    db.get('SELECT * FROM users WHERE username = ? ',[username],async(err,user)=>{
        if(err || !user) return res.status(401).json({error : "Invalid credentials"})

            const match = await bcrypt.compare(password,user.password)
            if(!match) return res.status(401).json({error : "Invalid credentials"})
                const token = jwt.sign({id : user.id, username: user.username,role : user.role, ref_id : user.ref_id},process.env.JWT_SECRET)
                res.json({token,user})
    })
})

//get visits reusable 

function getVisitsFromClinicianID(clinician_id, callback){
    db.all(`SELECT 
        v.id, 
        c.name AS clinician, 
        p.name AS patient, 
        v.notes, 
        v.startTime, 
        v.endTime
      FROM visits v
      JOIN clinicians c ON v.clinician_id = c.id
      JOIN patients p ON v.patient_id = p.id
      WHERE v.clinician_id = ?
      ORDER BY v.endTime DESC`,
               [clinician_id],callback)
}
//get visits
router.get('/visits',authenticateToken,(req,res)=>{
    const clinician_id = req.user?.id;
        getVisitsFromClinicianID (clinician_id,(err,rows)=>{
        if(err){
            return res.status(500).json({error : "Couldn't find the clinician"})
        }
        res.json(rows)
    })
})

// post visits
router.post('/visits', authenticateToken, (req, res) => {
    const clinician_id = req.user?.id;
    const { patient_id, startTime, endTime, notes } = req.body;
  
    if (!patient_id || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    const query = `
      INSERT INTO visits (patient_id, clinician_id, startTime, endTime, notes)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    db.run(
      query,
      [patient_id, clinician_id, startTime, endTime, notes || ''],
      function (err) {
        if (err) {
          console.error('DB Insert Error:', err);
          return res.status(500).json({ error: 'Failed to add visit' });
        }
  
        const insertedVisit = {
          id: this.lastID,
          patient_id,
          clinician_id,
          startTime,
          endTime,
          notes
        };
  
        res.status(200).json({ visits: insertedVisit,message:'added latest visit successfully' });
      }
    );
  });
  

  //get patients
router.get('/patients',authenticateToken,(req,res)=>{
    db.all(`SELECT * FROM patients `,(err,rows)=>{
        if(err){
            res.status(500).json({error : "Couldn't find the patients"})
        }
        res.json(rows)
    })
})
        


module.exports = router


