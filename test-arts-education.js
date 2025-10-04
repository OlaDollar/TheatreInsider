import { artsEducationScraper } from "./server/arts-education-scraper.js";

async function testArtsEducation() {
  console.log('🎭 Testing Arts Education Database...');
  
  try {
    // Run scraper
    const result = await artsEducationScraper.scrapeAllArtsEducationData();
    console.log('✅ Scrape result:', result);
    
    // Check counts
    const ukCount = await artsEducationScraper.getSchoolCount('UK');
    const usCount = await artsEducationScraper.getSchoolCount('US');
    console.log(`\n📊 Database contains:\n- UK schools: ${ukCount}\n- US schools: ${usCount}\n- Total: ${ukCount + usCount}`);
    
    // Get London schools
    const londonSchools = await artsEducationScraper.getSchoolsByRegion('london');
    console.log(`\n🏛️ Top 5 London Drama Schools (${londonSchools.length} total):`);
    
    londonSchools.forEach((school, index) => {
      console.log(`${index + 1}. ${school.shortName} - ${school.name}`);
      console.log(`   Founded: ${school.foundedYear} | Ranking: #${school.ranking} | Website: ${school.website}`);
      console.log(`   Notable Alumni: ${school.notableAlumni.slice(0, 3).join(', ')}...`);
    });
    
    // Show course details for first school
    if (londonSchools.length > 0) {
      const firstSchool = londonSchools[0];
      const courses = await artsEducationScraper.getSchoolCourses(firstSchool.id);
      const teachers = await artsEducationScraper.getSchoolTeachers(firstSchool.id);
      
      console.log(`\n📚 Course Details for ${firstSchool.shortName}:`);
      courses.forEach(course => {
        console.log(`- ${course.courseName}`);
        console.log(`  Duration: ${course.duration} | Fee: £${course.courseFee}/${course.currency} | Intake: ${course.intakeNumber} students`);
        console.log(`  Application Deadline: ${course.applicationDeadline}`);
        console.log(`  Certificate: ${course.certificateAwarded}`);
        console.log(`  Audition Required: ${course.audititionRequired ? 'Yes' : 'No'}`);
      });
      
      console.log(`\n👨‍🏫 Faculty (${teachers.length} teachers):`);
      teachers.forEach(teacher => {
        console.log(`- ${teacher.name} (${teacher.title})`);
        console.log(`  Specialization: ${teacher.specialization.join(', ')}`);
        console.log(`  Experience: ${teacher.experience}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testArtsEducation();