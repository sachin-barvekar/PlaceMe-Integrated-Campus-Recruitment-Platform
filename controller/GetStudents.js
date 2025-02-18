const { format } = require('date-fns')
const Student = require('../models/Student')
const User = require('../models/User')

exports.getAllStudents = async (req, res) => {
  try {
    let { page = 0, size = 10, search = '' } = req.query

    page = parseInt(page)
    size = parseInt(size)

    const limit = size === 0 ? 0 : size
    const skip = page * size

    let userQuery = {}
    if (search) {
      userQuery = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } },
        ],
      }
    }

    const matchingUsers = await User.find(userQuery).select('_id')
    const students = await Student.find({
      userId: { $in: matchingUsers.map(user => user._id) },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')

    const formattedStudents = students.map(student => {
      const { userId, ...studentData } = student.toObject()
      return {
        ...studentData,
        dateOfBirth:
          student.dateOfBirth && !isNaN(new Date(student.dateOfBirth))
            ? format(new Date(student.dateOfBirth), 'dd-MMM-yyyy')
            : '-',
        name: userId?.name || '',
        email: userId?.email || '',
      }
    })

    const totalElements = await Student.countDocuments({
      userId: { $in: matchingUsers.map(user => user._id) },
    })
    const totalPages = Math.ceil(totalElements / size)

    res.status(200).json({
      content: formattedStudents,
      totalElements,
      totalPages,
      last: page + 1 === totalPages,
      size,
      number: page,
      sort: {
        sorted: false,
        empty: students.length === 0,
        unsorted: true,
      },
      numberOfElements: students.length,
      first: page === 0,
      empty: students.length === 0,
    })
  } catch (error) {
    console.error('Error fetching students:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
