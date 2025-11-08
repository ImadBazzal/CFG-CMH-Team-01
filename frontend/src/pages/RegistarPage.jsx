import React, { useMemo, useState, useRef } from 'react'
import { Plus, Trash2, Edit2, Check, X, Upload, Download, Mail, FileText } from 'lucide-react'

// CLEP exam list for reference
const clepExams = [
  'American Government',
  'American Literature',
  'Analyzing & Interpreting Literature',
  'Biology',
  'Calculus',
  'Chemistry',
  'College Algebra',
  'College Composition',
  'College Mathematics',
  'English Literature',
  'Financial Accounting',
  'French Language',
  'German Language',
  'History of the United States I',
  'History of the United States II',
  'Human Growth and Development',
  'Information Systems',
  'Introductory Business Law',
  'Introductory Psychology',
  'Introductory Sociology',
  'Natural Sciences',
  'Precalculus',
  'Principles of Macroeconomics',
  'Principles of Microeconomics',
  'Principles of Management',
  'Principles of Marketing',
  'Spanish Language',
  'Western Civilization I',
  'Western Civilization II'
]

const prompts = [
  {
    theme: 'Authorization',
    question:
      'Are you the authorized registrar or institutional representative permitted to update your school\'s CLEP credit acceptance policy?',
    description:
      'If you\'re not the designated contact, please sign in with your institutional account or request access from your registrar\'s office.',
    badge: 'Access verified',
    hints: ['Institutional access', 'Registrar approval']
  },
  {
    theme: 'Data Accuracy',
    question:
      'When was the last time your institution\'s CLEP credit policy was reviewed or updated on our platform?',
    description:
      'Regular updates help students see the most accurate credit transfer information and reduce outdated listings.',
    badge: 'Last update: 3 months ago',
    hints: ['Policy review', 'Last update log']
  },
  {
    theme: 'Coverage',
    question:
      'Which CLEP exams are currently accepted by your institution, and what are the minimum passing scores for credit?',
    description:
      'List or confirm your institution\'s accepted CLEP exams and corresponding credit policies for each department.',
    badge: '26 exams accepted',
    hints: ['Credit chart', 'Department sync']
  },
  {
    theme: 'Verification',
    question:
      'Have all departments or campuses under your institution confirmed their CLEP equivalencies?',
    description:
      'Ensure each college or branch campus within your university system has signed off on its CLEP acceptance data.',
    badge: '2 departments pending',
    hints: ['Cross-campus', 'Sign-off needed']
  },
  {
    theme: 'Contact Information',
    question:
      'Who should students and advisors contact with questions about CLEP credit transfer policies?',
    description:
      'Provide the best contact point for CLEP-related inquiries to ensure accurate information reaches students.',
    badge: 'Contact updated',
    hints: ['Registrar email', 'Phone support']
  },
  {
    theme: 'Credit Details',
    question:
      'How many credit hours does your institution typically award for each accepted CLEP exam?',
    description:
      'Specify credit hour values to help students understand the academic value of each exam they complete.',
    badge: '3-6 credits per exam',
    hints: ['Credit hours', 'Course equivalencies']
  },
  {
    theme: 'Update & Review',
    question:
      'Would you like to add, update, or review your institution\'s CLEP acceptance data now?',
    description:
      'Make changes to your CLEP policies, add new exam acceptances, or update existing score requirements.',
    badge: 'Ready to edit',
    hints: ['Add exams', 'Update scores']
  }
]

const RegistrarPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [showDataEntry, setShowDataEntry] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [showEmailNotifications, setShowEmailNotifications] = useState(false)
  const fileInputRef = useRef(null)
  
  // email notification settings
  const [emailSettings, setEmailSettings] = useState({
    notifyOnChanges: true,
    notifyDepartments: true,
    notifyStudents: false,
    departmentEmails: 'math@university.edu, science@university.edu',
    additionalRecipients: ''
  })

  // mock existing data
  const [clepPolicies, setClepPolicies] = useState([
    {
      exam: 'American Government',
      minScore: 50,
      credits: 3,
      courseEquivalent: 'POLS 101',
      department: 'Political Science'
    },
    {
      exam: 'Biology',
      minScore: 50,
      credits: 4,
      courseEquivalent: 'BIO 101',
      department: 'Natural Sciences'
    },
    {
      exam: 'Calculus',
      minScore: 50,
      credits: 4,
      courseEquivalent: 'MATH 201',
      department: 'Mathematics'
    }
  ])

  // form state for new/editing entry
  const [formData, setFormData] = useState({
    exam: '',
    minScore: 50,
    credits: 3,
    courseEquivalent: '',
    department: ''
  })

  const activePrompt = useMemo(() => prompts[currentPrompt], [currentPrompt])

  const advancePrompt = () => {
    if (currentPrompt === prompts.length - 1) {
      setShowDataEntry(true)
    } else {
      setCurrentPrompt((prev) => prev + 1)
    }
  }

  const handleLogin = () => {
    if (email.trim()) {
      setIsLoggedIn(true)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  const handleAddPolicy = () => {
    if (formData.exam && formData.courseEquivalent && formData.department) {
      if (editingIndex !== null) {
        // update existing
        const updated = [...clepPolicies]
        updated[editingIndex] = formData
        setClepPolicies(updated)
        setEditingIndex(null)
      } else {
        // add new
        setClepPolicies([...clepPolicies, formData])
      }
      // reset form
      setFormData({
        exam: '',
        minScore: 50,
        credits: 3,
        courseEquivalent: '',
        department: ''
      })
    }
  }

  const handleEdit = (index) => {
    setFormData(clepPolicies[index])
    setEditingIndex(index)
  }

  const handleDelete = (index) => {
    setClepPolicies(clepPolicies.filter((_, i) => i !== index))
  }

  const handleCancelEdit = () => {
    setFormData({
      exam: '',
      minScore: 50,
      credits: 3,
      courseEquivalent: '',
      department: ''
    })
    setEditingIndex(null)
  }

  // bulk import functionality
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const text = event.target.result
          const rows = text.split('\n').slice(1) // skip header row
          const importedPolicies = []
          
          rows.forEach(row => {
            const cols = row.split(',').map(col => col.trim())
            if (cols.length >= 5 && cols[0]) {
              importedPolicies.push({
                exam: cols[0],
                minScore: parseInt(cols[1]) || 50,
                credits: parseInt(cols[2]) || 3,
                courseEquivalent: cols[3],
                department: cols[4]
              })
            }
          })
          
          if (importedPolicies.length > 0) {
            setClepPolicies([...clepPolicies, ...importedPolicies])
            alert(`Successfully imported ${importedPolicies.length} policies!`)
            setShowBulkImport(false)
          }
        } catch (error) {
          alert('Error parsing CSV file. Please check the format.')
        }
      }
      reader.readAsText(file)
    }
  }

  // download template
  const downloadTemplate = () => {
    const csvContent = 'Exam Name,Minimum Score,Credit Hours,Course Equivalent,Department\n' +
      'American Government,50,3,POLS 101,Political Science\n' +
      'Biology,50,4,BIO 101,Natural Sciences\n'
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'clep_policy_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // export current policies
  const exportPolicies = () => {
    let csvContent = 'Exam Name,Minimum Score,Credit Hours,Course Equivalent,Department\n'
    clepPolicies.forEach(policy => {
      csvContent += `${policy.exam},${policy.minScore},${policy.credits},${policy.courseEquivalent},${policy.department}\n`
    })
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'clep_policies_export.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleSaveAll = () => {
    // mock save functionality with email notification
    if (emailSettings.notifyOnChanges) {
      const recipients = []
      if (emailSettings.notifyDepartments) {
        recipients.push(...emailSettings.departmentEmails.split(',').map(e => e.trim()))
      }
      if (emailSettings.additionalRecipients) {
        recipients.push(...emailSettings.additionalRecipients.split(',').map(e => e.trim()))
      }
      
      alert(
        `Successfully saved ${clepPolicies.length} CLEP policies!\n\n` +
        `Email notifications sent to:\n${recipients.join('\n')}`
      )
    } else {
      alert(`Successfully saved ${clepPolicies.length} CLEP policies for your institution!`)
    }
    
    setShowDataEntry(false)
    setCurrentPrompt(0)
  }

  const saveEmailSettings = () => {
    alert('Email notification preferences saved!')
    setShowEmailNotifications(false)
  }

  // login Screen
  if (!isLoggedIn) {
    return (
      <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_20%,rgba(71,134,255,0.25),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,86,180,0.25),transparent_40%),linear-gradient(135deg,#030712,#020310_55%,#050917)] px-4 py-10 sm:px-6 lg:px-12">
        <div
          className="pointer-events-none absolute -right-[10%] -top-[25%] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(80,120,255,0.3),transparent_60%)] blur-[8px]"
          aria-hidden="true"
        />
        <section className="relative z-10 w-full max-w-md rounded-[32px] border border-white/10 bg-gradient-to-br from-[#070916]/90 to-[#070b20]/70 p-6 sm:p-10 lg:p-14 shadow-panel backdrop-blur-3xl">
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              CLEP ACCEPTANCE PULSE
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-[2.4rem]">
              Registrar Console
            </h1>
            <p className="mt-3 text-base text-white/70">
              Sign in to manage your institution's CLEP acceptance status.
            </p>
          </header>

          <div className="mt-8">
            <label htmlFor="email" className="block text-sm font-semibold text-white/80 mb-3">
              Institution Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="registrar@university.edu"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-base text-white placeholder-white/40 transition focus:border-white/30 focus:bg-white/10 focus:outline-none"
            />
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              className="w-full rounded-full bg-gradient-to-r from-[#6f7dff] to-[#5ecfff] px-6 py-3 text-sm font-semibold text-[#020308] shadow-[0_12px_25px_rgba(94,207,255,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(94,207,255,0.35)]"
              onClick={handleLogin}
            >
              Sign in
            </button>
            <p className="text-center text-xs text-white/50">
              Proof of concept — any email will proceed
            </p>
          </div>
        </section>
      </main>
    )
  }

  // bulk Import Modal
  if (showBulkImport) {
    return (
      <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_20%,rgba(71,134,255,0.25),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,86,180,0.25),transparent_40%),linear-gradient(135deg,#030712,#020310_55%,#050917)] px-4 py-10 sm:px-6 lg:px-12">
        <div
          className="pointer-events-none absolute -right-[10%] -top-[25%] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(80,120,255,0.3),transparent_60%)] blur-[8px]"
          aria-hidden="true"
        />
        <section className="relative z-10 w-full max-w-3xl rounded-[32px] border border-white/10 bg-gradient-to-br from-[#070916]/90 to-[#070b20]/70 p-6 sm:p-10 lg:p-14 shadow-panel backdrop-blur-3xl">
          <header className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              BULK IMPORT
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-[2.4rem]">
              Import CLEP Policies
            </h1>
            <p className="mt-3 text-base text-white/70">
              Upload a CSV file to quickly add multiple CLEP policies at once.
            </p>
          </header>

          <div className="space-y-6">
            {/* instructions */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                CSV Format Requirements
              </h2>
              <ul className="space-y-2 text-sm text-white/70">
                <li>• First row must be headers: Exam Name, Minimum Score, Credit Hours, Course Equivalent, Department</li>
                <li>• Each subsequent row represents one CLEP policy</li>
                <li>• Ensure exam names match our official CLEP exam list</li>
                <li>• Minimum scores should be between 20-80</li>
                <li>• Credit hours should be between 1-12</li>
              </ul>
            </div>

            {/* download template */}
            <button
              onClick={downloadTemplate}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white/80 transition hover:bg-white/10"
            >
              <Download className="w-5 h-5" />
              <span className="font-semibold">Download CSV Template</span>
            </button>

            {/* upload area */}
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/70 mb-4">
                Drag and drop your CSV file here, or click to browse
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full bg-gradient-to-r from-[#6f7dff] to-[#5ecfff] px-6 py-2.5 text-sm font-semibold text-[#020308] shadow-[0_8px_20px_rgba(94,207,255,0.25)] transition hover:-translate-y-0.5"
              >
                Choose File
              </button>
            </div>
          </div>

          {/* action buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => setShowBulkImport(false)}
              className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/20"
            >
              Cancel
            </button>
          </div>
        </section>
      </main>
    )
  }

  // email notifications modal
  if (showEmailNotifications) {
    return (
      <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_20%,rgba(71,134,255,0.25),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,86,180,0.25),transparent_40%),linear-gradient(135deg,#030712,#020310_55%,#050917)] px-4 py-10 sm:px-6 lg:px-12">
        <div
          className="pointer-events-none absolute -right-[10%] -top-[25%] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(80,120,255,0.3),transparent_60%)] blur-[8px]"
          aria-hidden="true"
        />
        <section className="relative z-10 w-full max-w-3xl rounded-[32px] border border-white/10 bg-gradient-to-br from-[#070916]/90 to-[#070b20]/70 p-6 sm:p-10 lg:p-14 shadow-panel backdrop-blur-3xl">
          <header className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              NOTIFICATION SETTINGS
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-[2.4rem]">
              Email Notifications
            </h1>
            <p className="mt-3 text-base text-white/70">
              Configure who receives notifications when CLEP policies are updated.
            </p>
          </header>

          <div className="space-y-6">
            {/* toggle options */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Send notifications on changes</p>
                  <p className="text-sm text-white/60">Alert stakeholders when policies are updated</p>
                </div>
                <button
                  onClick={() => setEmailSettings({...emailSettings, notifyOnChanges: !emailSettings.notifyOnChanges})}
                  className={`relative w-12 h-6 rounded-full transition ${emailSettings.notifyOnChanges ? 'bg-gradient-to-r from-[#6f7dff] to-[#5ecfff]' : 'bg-white/20'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${emailSettings.notifyOnChanges ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Notify departments</p>
                  <p className="text-sm text-white/60">Send updates to department contacts</p>
                </div>
                <button
                  onClick={() => setEmailSettings({...emailSettings, notifyDepartments: !emailSettings.notifyDepartments})}
                  className={`relative w-12 h-6 rounded-full transition ${emailSettings.notifyDepartments ? 'bg-gradient-to-r from-[#6f7dff] to-[#5ecfff]' : 'bg-white/20'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${emailSettings.notifyDepartments ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Notify students</p>
                  <p className="text-sm text-white/60">Alert current students about policy changes</p>
                </div>
                <button
                  onClick={() => setEmailSettings({...emailSettings, notifyStudents: !emailSettings.notifyStudents})}
                  className={`relative w-12 h-6 rounded-full transition ${emailSettings.notifyStudents ? 'bg-gradient-to-r from-[#6f7dff] to-[#5ecfff]' : 'bg-white/20'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${emailSettings.notifyStudents ? 'translate-x-6' : ''}`} />
                </button>
              </div>
            </div>

            {/* email lists */}
            {emailSettings.notifyDepartments && (
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-3">
                  Department Email Addresses
                </label>
                <textarea
                  value={emailSettings.departmentEmails}
                  onChange={(e) => setEmailSettings({...emailSettings, departmentEmails: e.target.value})}
                  placeholder="math@university.edu, science@university.edu"
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-white/30 focus:bg-white/10 focus:outline-none resize-none"
                />
                <p className="text-xs text-white/50 mt-2">Separate multiple emails with commas</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-white/80 mb-3">
                Additional Recipients (Optional)
              </label>
              <textarea
                value={emailSettings.additionalRecipients}
                onChange={(e) => setEmailSettings({...emailSettings, additionalRecipients: e.target.value})}
                placeholder="advisor@university.edu, dean@university.edu"
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-white/30 focus:bg-white/10 focus:outline-none resize-none"
              />
            </div>

            {/* preview */}
            <div className="rounded-2xl border border-blue-200/30 bg-blue-300/10 p-6">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Preview
              </h3>
              <div className="text-sm text-white/70 space-y-2">
                <p className="font-semibold text-white">Subject: CLEP Policy Updates - [Your Institution]</p>
                <p>Dear Team,</p>
                <p>The following CLEP credit acceptance policies have been updated:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>3 new policies added</li>
                  <li>2 policies modified</li>
                </ul>
                <p>Please review the changes in the registrar portal.</p>
              </div>
            </div>
          </div>

          {/* action buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => setShowEmailNotifications(false)}
              className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/20"
            >
              Cancel
            </button>
            <button
              onClick={saveEmailSettings}
              className="rounded-full bg-gradient-to-r from-[#6f7dff] to-[#5ecfff] px-6 py-3 text-sm font-semibold text-[#020308] shadow-[0_12px_25px_rgba(94,207,255,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(94,207,255,0.35)]"
            >
              Save Settings
            </button>
          </div>
        </section>
      </main>
    )
  }

  // data entry screen
  if (showDataEntry) {
    return (
      <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_20%,rgba(71,134,255,0.25),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,86,180,0.25),transparent_40%),linear-gradient(135deg,#030712,#020310_55%,#050917)] px-4 py-10 sm:px-6 lg:px-12">
        <div
          className="pointer-events-none absolute -right-[10%] -top-[25%] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(80,120,255,0.3),transparent_60%)] blur-[8px]"
          aria-hidden="true"
        />
        <section className="relative z-10 w-full max-w-6xl rounded-[32px] border border-white/10 bg-gradient-to-br from-[#070916]/90 to-[#070b20]/70 p-6 sm:p-10 lg:p-14 shadow-panel backdrop-blur-3xl">
          <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                CLEP Policy Management
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-white sm:text-[2.4rem]">
                Update Your CLEP Acceptance Data
              </h1>
              <p className="mt-3 text-base text-white/70">
                Add, edit, or remove CLEP exam policies for your institution.
              </p>
            </div>
            
            {/* quick action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkImport(true)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
              >
                <Upload className="w-4 h-4" />
                Bulk Import
              </button>
              <button
                onClick={exportPolicies}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => setShowEmailNotifications(true)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
              >
                <Mail className="w-4 h-4" />
                Notifications
              </button>
            </div>
          </header>

          {/* add/edit form */}
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {editingIndex !== null ? 'Edit CLEP Policy' : 'Add New CLEP Policy'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  CLEP Exam
                </label>
                <select
                  value={formData.exam}
                  onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-white/30 focus:bg-white/10 focus:outline-none"
                >
                  <option value="">Select exam...</option>
                  {clepExams.map(exam => (
                    <option key={exam} value={exam} className="bg-gray-900">{exam}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Minimum Score
                </label>
                <input
                  type="number"
                  value={formData.minScore}
                  onChange={(e) => setFormData({ ...formData, minScore: parseInt(e.target.value) })}
                  min="20"
                  max="80"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-white/30 focus:bg-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Credit Hours
                </label>
                <input
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                  min="1"
                  max="12"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-white/30 focus:bg-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Course Equivalent
                </label>
                <input
                  type="text"
                  value={formData.courseEquivalent}
                  onChange={(e) => setFormData({ ...formData, courseEquivalent: e.target.value })}
                  placeholder="e.g., MATH 201"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 focus:border-white/30 focus:bg-white/10 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g., Mathematics"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 focus:border-white/30 focus:bg-white/10 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddPolicy}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6f7dff] to-[#5ecfff] px-6 py-2.5 text-sm font-semibold text-[#020308] shadow-[0_8px_20px_rgba(94,207,255,0.25)] transition hover:-translate-y-0.5"
              >
                {editingIndex !== null ? (
                  <>
                    <Check className="w-4 h-4" />
                    Update Policy
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Policy
                  </>
                )}
              </button>
              
              {editingIndex !== null && (
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* current policies list */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">
              Current CLEP Policies ({clepPolicies.length})
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {clepPolicies.map((policy, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">{policy.exam}</h3>
                      <span className="rounded-full bg-blue-300/15 px-3 py-0.5 text-xs text-blue-50/80">
                        Min Score: {policy.minScore}
                      </span>
                      <span className="rounded-full bg-purple-300/15 px-3 py-0.5 text-xs text-purple-50/80">
                        {policy.credits} credits
                      </span>
                    </div>
                    <p className="text-sm text-white/70">
                      {policy.courseEquivalent} • {policy.department}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="rounded-lg bg-white/10 p-2 text-white/80 transition hover:bg-white/20"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="rounded-lg bg-red-500/20 p-2 text-red-200 transition hover:bg-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* action buttons */}
          <div className="flex flex-wrap justify-end gap-3">
            <button
              onClick={() => setShowDataEntry(false)}
              className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/20"
            >
              Back to Questions
            </button>
            <button
              onClick={handleSaveAll}
              className="rounded-full bg-gradient-to-r from-[#6f7dff] to-[#5ecfff] px-6 py-3 text-sm font-semibold text-[#020308] shadow-[0_12px_25px_rgba(94,207,255,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(94,207,255,0.35)]"
            >
              Save All Changes
            </button>
          </div>
        </section>
      </main>
    )
  }

  // -------QUESTIONNAIRE SCREEN---------
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_20%,rgba(71,134,255,0.25),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,86,180,0.25),transparent_40%),linear-gradient(135deg,#030712,#020310_55%,#050917)] px-4 py-10 sm:px-6 lg:px-12">
      <div
        className="pointer-events-none absolute -right-[10%] -top-[25%] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(80,120,255,0.3),transparent_60%)] blur-[8px]"
        aria-hidden="true"
      />
      <section className="relative z-10 w-full max-w-4xl rounded-[32px] border border-white/10 bg-gradient-to-br from-[#070916]/90 to-[#070b20]/70 p-6 sm:p-10 lg:p-14 shadow-panel backdrop-blur-3xl">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              CLEP acceptance pulse
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-[2.4rem]">
              Registrar console
            </h1>
            <p className="mt-3 max-w-xl text-base text-white/70">
              Manage your institution's CLEP acceptance status one step at a time.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center text-sm text-white/80">
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/60">
              Live status
            </span>
            <strong className="text-lg font-semibold text-white">{activePrompt.badge}</strong>
          </div>
        </header>

        <section className="mt-8 flex flex-col gap-3">
          <p className="w-fit rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
            {activePrompt.theme}
          </p>
          <p className="text-2xl font-semibold leading-snug text-white sm:text-3xl">
            {activePrompt.question}
          </p>
          <p className="max-w-2xl text-base text-white/70">{activePrompt.description}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {activePrompt.hints.map((hint) => (
              <span
                key={hint}
                className="rounded-full border border-blue-200/30 bg-blue-300/15 px-4 py-1.5 text-sm text-blue-50/80"
              >
                {hint}
              </span>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <div className="flex flex-1 gap-2">
            {prompts.map((_, index) => {
              const height = index === currentPrompt ? 'h-1.5' : 'h-1'
              const state =
                index === currentPrompt
                  ? 'bg-[linear-gradient(90deg,#9f7bff,#5ea5ff)]'
                  : index < currentPrompt
                  ? 'bg-blue-300/60'
                  : 'bg-white/15'
              return (
                <span
                  key={index}
                  className={`flex-1 rounded-full transition-all duration-200 ${height} ${state}`}
                />
              )
            })}
          </div>
          <p className="text-sm font-semibold tracking-[0.2em] text-white/60">
            {String(currentPrompt + 1).padStart(2, '0')} / {String(prompts.length).padStart(2, '0')}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            className="w-full rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/20 sm:w-auto"
            onClick={advancePrompt}
          >
            {currentPrompt === prompts.length - 1 ? 'Skip for now' : 'Remind me later'}
          </button>
          <button
            type="button"
            className="w-full rounded-full bg-gradient-to-r from-[#6f7dff] to-[#5ecfff] px-6 py-3 text-sm font-semibold text-[#020308] shadow-[0_12px_25px_rgba(94,207,255,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(94,207,255,0.35)] sm:w-auto"
            onClick={advancePrompt}
          >
            {currentPrompt === prompts.length - 1 ? 'Update Policies' : 'Next question'}
          </button>
        </div>
      </section>
    </main>
  )
}

export default RegistrarPage
