const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://sewglpdgwvgmlovpjbpb.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNld2dscGRnd3ZnbWxvdnBqYnBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA4ODM2OCwiZXhwIjoyMDgxNjY0MzY4fQ.9jePKUxfAkLTqDyZIqVD-e-A-MkS_Op8Qtmkciou9ds'

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function seedAdmin() {
  const email = 'admin@frybstudio.com'
  constpassword = 'password123'

  console.log(`Attempting to create admin user: ${email}`)

  // 1. Create User in Auth
  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email,
    password: 'password123',
    email_confirm: true,
    user_metadata: {
      full_name: 'FRYB Admin'
    }
  })

  if (createError) {
    console.error('Error creating user:', createError.message)
    // If user already exists, try to get their ID
    if (createError.message.includes('already registered')) {
      console.log('User already exists, looking up...')
      // Note: Admin API doesn't have getUserByEmail directly exposed easily without listUsers in some versions,
      // but let's try to update the profile anyway if we can find them or just inform user.
      // For now, let's assume we want to update if they exist.
      // We can list users to find the ID.
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
      const existingUser = users.find(u => u.email === email)
      
      if (existingUser) {
        console.log(`Found existing user ID: ${existingUser.id}`)
        updateProfile(existingUser.id)
      }
    }
    return
  }

  if (user && user.user) {
    console.log(`User created with ID: ${user.user.id}`)
    await updateProfile(user.user.id)
  }
}

async function updateProfile(userId) {
  // 2. Update Profile to be Admin
  // Note: The trigger might have created the profile as 'client' already.
  // We need to update it to 'admin'.
  
  // Wait a bit for trigger to fire if it was just created
  await new Promise(resolve => setTimeout(resolve, 1000))

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', userId)

  if (updateError) {
    console.error('Error updating profile role:', updateError.message)
  } else {
    console.log('Successfully updated user role to admin!')
    console.log('Credentials:')
    console.log('Email: admin@frybstudio.com')
    console.log('Password: password123')
  }
}

seedAdmin()
