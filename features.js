// features.js

// Array of features with heading, description, and optional media (image or video)
const featuresData = [
    {
      heading: "Smart Classrooms",
      description: `Our Smart Classrooms are designed with state-of-the-art digital boards, high-resolution projectors, and interactive screens that enhance learning experiences. Each classroom is equipped with modern seating arrangements, high-speed Wi-Fi, and energy-efficient lighting to provide a comfortable and productive environment for students. Lectures can be recorded for online reference, and virtual collaboration tools are integrated to allow remote participation. The classrooms are ergonomically designed to ensure long-duration comfort, encouraging student engagement and creativity. From coding sessions to group discussions, these classrooms are flexible and adaptable, making learning both interactive and fun. In addition, the campus promotes green initiatives with natural lighting and air circulation, reducing carbon footprint and promoting sustainable education practices. With cutting-edge technology and modern infrastructure, students are empowered to excel in both academics and practical skills.`,
      media: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWYJRAb-RlvDwFFyTuGjn4s14IHTnMjAzNjQ&s" // Image
    },
    {
      heading: "Research Labs",
      description: `Our Research Labs are equipped with the latest machinery, instrumentation, and software required for advanced research in fields like Computer Science, Mechanical Engineering, and Electronics & Communication. Students and faculty engage in hands-on experimentation, data analysis, and prototyping, encouraging innovation and practical application of theories learned in classrooms. Labs are maintained with strict safety protocols, ensuring a secure environment for experiments. Access to cloud-based simulation tools and modern hardware allows students to work on real-world projects. Interdisciplinary collaborations are encouraged, and students are mentored by experienced faculty to enhance their research skills. Regular workshops, seminars, and industry visits are conducted to supplement lab learning. With dedicated spaces for team-based projects, individual research, and innovation challenges, our labs serve as a launchpad for breakthrough discoveries and entrepreneurial ideas.`,
      media: "https://via.placeholder.com/300x180?text=Research+Labs"
    },
    {
      heading: "Digital Library",
      description: `Our Digital Library hosts over 50,000 books and an extensive collection of online journals, e-books, and research papers. It is a hub for academic exploration, providing students and faculty access to a wide range of resources across multiple disciplines. The library is fully digitized, offering remote access to subscribed journals, e-resources, and collaborative study tools. With quiet zones for focused study, interactive discussion areas, and advanced search engines, students can conduct in-depth research efficiently. The library also integrates AI-based recommendation systems to help students discover relevant reading material and recent publications. Multimedia resources such as audio books, educational videos, and tutorials supplement traditional texts, ensuring diverse learning options. With dedicated librarians and technical support, our digital library promotes self-directed learning, research excellence, and academic growth.`,
      media: `<video width="100%" controls style="border-radius:10px;"><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">Your browser does not support HTML video.</video>`
    },
    {
      heading: "Sports Complex",
      description: `Our Sports Complex is designed to foster physical well-being and teamwork. It features cricket grounds, football fields, badminton courts, and indoor games facilities, providing ample opportunities for students to engage in recreational and competitive sports. Professional coaching is available for various disciplines, and inter-college tournaments are regularly organized. Fitness centers and gymnasiums are equipped with modern exercise equipment. Students are encouraged to participate in wellness programs, yoga sessions, and aerobics classes. The complex also supports e-sports and indoor activities for holistic development. Our green campus ensures natural surroundings for outdoor activities, promoting mental relaxation alongside physical fitness. Sports initiatives help cultivate leadership skills, discipline, and a healthy lifestyle, complementing academic growth.`,
      media: "https://via.placeholder.com/300x180?text=Sports+Complex"
    }
  ];
  
  // Function to render features
  function renderFeatures() {
    const grid = document.getElementById("featureGrid");
    grid.innerHTML = ""; // Clear existing content
  
    featuresData.forEach(feature => {
      const card = document.createElement("div");
      card.className = "fcard";
      card.style.cssText = `
        background:#fff;
        padding:20px;
        border-radius:15px;
        box-shadow:0 5px 15px rgba(0,0,0,0.1);
        transition:0.3s;
        cursor:pointer;
      `;
  
      card.onmouseover = () => {
        card.style.transform = "scale(1.05)";
        card.style.boxShadow = "0 10px 20px rgba(0,0,0,0.2)";
      };
      card.onmouseout = () => {
        card.style.transform = "scale(1)";
        card.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
      };
  
      let mediaHTML = "";
      if (feature.media) {
        // Check if media is an HTML tag (like video) or image URL
        if (feature.media.trim().startsWith("<")) {
          mediaHTML = feature.media;
        } else {
          mediaHTML = `<img src="${feature.media}" alt="${feature.heading}" style="width:100%;border-radius:10px;margin-bottom:10px;">`;
        }
      }
  
      card.innerHTML = `
        ${mediaHTML}
        <h5 style="color:#3F5EFB;margin-bottom:10px;">${feature.heading}</h5>
        <p style="color:#333;text-align:justify;">${feature.description}</p>
      `;
  
      grid.appendChild(card);
    });
  }
  
  // Call the function to render on page load
  document.addEventListener("DOMContentLoaded", renderFeatures);