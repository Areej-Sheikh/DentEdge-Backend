const DoctorSlot = require("../models/DoctorSlot");


// GET slots by doctor + clinic + date
exports.getSlotsByDate = async (req, res) => {

    try {

        const { doctorId, clinicId, date } = req.query;

        if (!doctorId || !clinicId || !date) {
            return res.status(400).json({
                message: "doctorId, clinicId and date are required"
            });
        }

        const queryDate = new Date(date);

        const slots = await DoctorSlot.find({
            doctorId,
            clinicId,
            date: queryDate
        }).sort({ time: 1 });

        const formattedSlots = slots.map(slot => ({
            slotId: slot._id,
            time: slot.time,
            available: !slot.isBooked
        }));

        res.json({
            success: true,
            slots: formattedSlots
        });

        console.log("Fetched Slots By Date");

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch slots"
        });

    }

};



// GENERATE slots for doctor
exports.generateSlots = async (req, res) => {

  try {

    const { doctorId, clinicId, date } = req.body;

    const slots = [];

    // example slot generation
    let start = 10 * 60; // 10:00
    let end = 17 * 60;   // 17:00
    const duration = 30;

    while (start < end) {

      const hours = Math.floor(start / 60);
      const minutes = start % 60;

      const time = `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}`;

      const slot = await DoctorSlot.create({
        doctorId,
        clinicId,
        date,
        time
      });

      slots.push(slot);

      start += duration;

    }

    res.json({
      success: true,
      message: "Slots generated successfully",
      totalSlots: slots.length,
      slots
    });
    console.log("Slots generated successfully");

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Slot generation failed"
    });

  }

};



// UPDATE SLOT (time / availability)
exports.updateSlot = async (req, res) => {

    try {

        const { time, isBooked } = req.body;

        const slot = await DoctorSlot.findById(req.params.id);

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: "Slot not found"
            });
        }

        // Prevent editing booked slot
        if (slot.isBooked && time) {
            return res.status(400).json({
                success: false,
                message: "Cannot modify time of a booked slot"
            });
        }

        if (time !== undefined) slot.time = time;
        if (isBooked !== undefined) slot.isBooked = isBooked;

        await slot.save();

        res.json({
            success: true,
            slot
        });

        console.log("Slot updated");

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Slot update failed"
        });

    }

};  