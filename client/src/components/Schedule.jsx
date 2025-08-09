
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import axios from 'axios'
import { default as React, useEffect, useState } from 'react'
import { API } from '../utils/constants'



const Schedule = ({ visits=[], patients=[],user,fetchVisits })=> {
  const [events, setEvents] = useState([]);
  const [showModal,setShowModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  

  useEffect(() => {
    setEvents(visits?.map(v => ({
      id: v.id,
      title: v.notes,
      start: v.startTime,
      end: v.endTime,
      patientName : v.patient
    })))
  }, [visits?.length])

  const handleDateSelect = (selectInfo) => {
   
    const newEvent ={
            id: String(events?.length +1),
            title : '',
            patientName  :'',
            start:selectInfo.startStr,
            end  :selectInfo?.endStr,
            allDay : selectInfo.allDay
        }
        setShowModal(true)
        setSelectedEvent(newEvent)
    
  }
 
  const handleSaveEvent = async()=>{
      const newStart = new Date(selectedEvent?.start)
      const newEnd = new Date(selectedEvent?.end)
      const duplicateEvent = events?.some(item=> {
        return (item?.patientName === selectedEvent?.patientName && ((new Date(item?.start) < newEnd) && new Date(item?.end)>newStart))
      })
      if(duplicateEvent){
        alert('This patient already has a visit')
        return;
      }
      
      let payload={  
        patient_id : Number(selectedEvent?.patientName),
        clinician_id : user?.user?.id ? Number(user?.user?.id) : '',
        startTime : selectedEvent?.start,
        endTime : selectedEvent?.end,
        notes : selectedEvent?.title}
      const res = await axios.post(API+'/visits',payload,{
        headers:{Authorization : `Bearer ${user?.token}`,'Content-Type':'application/json'}})
      if([200,201].includes(res?.status)){
        fetchVisits && await fetchVisits()
      }
      setShowModal(false)    
      setSelectedEvent(null)
  }


  return (
    <div className="p-4 w-full bg-white rounded shadow">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        select={handleDateSelect}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        editable
        selectable
        selectMirror    
        eventDrop={(info) => console.log('Dropped:', info.event)}
      />
      {showModal && 
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-300 '>
      <div className='w-[400px] bg-white p-6 rounded-lg shadow-lg'>
        <div className='flex flex-col gap-3'>
        <h2 className='text-3xl'>
            Add Visit
        </h2>
        <label className='text-start'> Title</label>
        <input value={selectedEvent?.title} placeholder='enter visit info' className='outline-none border-gray-300 border rounded-lg p-2
        ' onChange={(e) =>
                setSelectedEvent({ ...selectedEvent, title: e.target.value })
              } />

        <label className='text-start'> Patient Name</label>
        <select value={selectedEvent?.patientName} onChange={(e) =>
                setSelectedEvent({ ...selectedEvent, patientName: e.target.value })
              } className='outline-none border-gray-300 border rounded-lg p-2'>
            <option value=''>Select Patient</option>
            {patients?.map(item=> (<option key={item?.name} value={item?.id}>{item?.name}</option>))}
            </select>
            <label className="block mb-2 text-start font-medium">Start Time</label>
            <input
              type="datetime-local"
              className="border rounded w-full p-2 mb-4 border-gray-300"
              value={selectedEvent.start?.slice(0, 16)}
              onChange={(e) =>
                setSelectedEvent({ ...selectedEvent, start: e.target.value })
              }
            />
            <label className="block mb-2 font-medium text-start ">End Time</label>
            <input
              type="datetime-local"
              className="border rounded w-full p-2 mb-4 border-gray-300"
              value={selectedEvent.end?.slice(0, 16)}
              onChange={(e) =>
                setSelectedEvent({ ...selectedEvent, end: e.target.value })
              }
            />
            <div>
                <button className='text-black border border-gray-700 ' onClick={()=>setShowModal(pre=> !pre)}>Cancel</button>
                <button className='text-white bg-blue-500 ml-3' onClick={handleSaveEvent} disabled={!selectedEvent?.title || !selectedEvent?.patientName || !selectedEvent?.start || !selectedEvent?.end}>Save</button>
                </div>
            </div>
        </div></div>}
    </div>
  )
}

export default Schedule
