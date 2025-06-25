document.getElementById("attendanceForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  // ✅ 1. Time Check: Allow only between 9:00–9:30 AM
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();

  if (hour !== 9 || minutes > 30) {
    alert("⏰ Attendance is only allowed from 5:00 AM to 6:30 pM.");
    return;
  }

  // ✅ 2. Get location
  if (!navigator.geolocation) {
    alert("📍 Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // ✅ 3. Collect form data
    const formData = {
      name: document.querySelector("input[name='name']").value,
      roll: document.querySelector("input[name='roll']").value,
      date: document.querySelector("input[name='date']").value,
      latitude,
      longitude,
    };

    // ✅ 4. Send to backend
    const response = await fetch("/submit-attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("✅ Attendance submitted!");
      document.getElementById("attendanceForm").reset();
    } else {
      const err = await response.text();
      alert("❌ " + err);
    }
  }, () => {
    alert("❌ Unable to fetch location. Please allow location access.");
  });
});