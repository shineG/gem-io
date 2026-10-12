document.addEventListener("DOMContentLoaded", () => {

  const buttons =
    document.querySelectorAll(".gallery-item-button");

  if (!buttons.length) {
    return;
  }


  /* -------------------------------------------------------
     Create Viewer
     ------------------------------------------------------- */

  const viewer =
    document.createElement("div");

  viewer.className = "gallery-viewer";

  viewer.innerHTML = `
    <button
      type="button"
      class="gallery-viewer-close"
      aria-label="关闭"
    >
      ×
    </button>

    <div class="gallery-viewer-content">

      <img
        class="gallery-viewer-image"
        src=""
        alt=""
      >

      <div class="gallery-viewer-info">

        <p
          class="gallery-viewer-description"
        ></p>

        <div
          class="gallery-viewer-exif"
        ></div>

        <div class="gallery-viewer-shooting-time"></div>

      </div>

    </div>
  `;

  document.body.appendChild(viewer);


  /* -------------------------------------------------------
     Elements
     ------------------------------------------------------- */

  const viewerImage =
    viewer.querySelector(
      ".gallery-viewer-image"
    );

  const viewerDescription =
    viewer.querySelector(
      ".gallery-viewer-description"
    );

  const viewerExif =
    viewer.querySelector(
      ".gallery-viewer-exif"
    );

  const viewerShootingTime =
    viewer.querySelector(
      ".gallery-viewer-shooting-time"
    );

  const closeButton =
    viewer.querySelector(
      ".gallery-viewer-close"
    );


  /* -------------------------------------------------------
     Format EXIF
     ------------------------------------------------------- */

  const formatExif = (button) => {

    const cameraModel =
      button.dataset.galleryCameraModel || "";

    const lens =
      button.dataset.galleryLens || "";

    const focalLength =
      button.dataset.galleryFocalLength || "";

    const aperture =
      button.dataset.galleryAperture || "";

    const shutterSpeed =
      button.dataset.galleryShutterSpeed || "";

    const iso =
      button.dataset.galleryIso || "";


    /* -----------------------------------------------------
       Camera
       ----------------------------------------------------- */

    const camera =
      cameraModel;


    /* -----------------------------------------------------
       Main Camera Information
       ----------------------------------------------------- */

    const cameraParts = [];

    if (camera) {
      cameraParts.push(camera);
    }

    if (lens) {
      cameraParts.push(lens);
    }


    /* -----------------------------------------------------
       Shooting Information
       ----------------------------------------------------- */

    const shootingParts = [];


    if (focalLength) {

      shootingParts.push(
        `${focalLength}mm`
      );

    }


    if (aperture) {

      shootingParts.push(
        `f/${aperture}`
      );

    }


    if (shutterSpeed) {

      shootingParts.push(
        `${shutterSpeed}s`
      );

    }


    if (iso) {

      shootingParts.push(
        `ISO ${iso}`
      );

    }


    /* -----------------------------------------------------
       Build EXIF HTML
       ----------------------------------------------------- */

    let html = "";


    if (cameraParts.length) {

      html += `
        <div class="gallery-viewer-exif-camera">
          ${cameraParts.join(" · ")}
        </div>
      `;

    }


    if (shootingParts.length) {

      html += `
        <div class="gallery-viewer-exif-settings">
          ${shootingParts.join(" · ")}
        </div>
      `;

    }


    return html;
  };


  /* -------------------------------------------------------
     Open Viewer
     ------------------------------------------------------- */

  buttons.forEach((button) => {

    button.addEventListener("click", () => {

      const image =
        button.dataset.galleryImage;

      const title =
        button.dataset.galleryTitle || "";

      const description =
        button.dataset.galleryDescription || "";

      const shootingTime =
        button.dataset.galleryShootingTime || "";

      /* Image */

      viewerImage.src = image;

      viewerImage.alt = title;


      /* Description */

      viewerDescription.textContent =
        description;


      /* EXIF */

      viewerExif.innerHTML =
        formatExif(button);

      /* Original shooting time */

      if (shootingTime) {
        viewerShootingTime.textContent =
          `拍摄时间：${shootingTime.split(" ")[0].replaceAll(":", "-")}`;
        viewerShootingTime.hidden = false;
      } else {
        viewerShootingTime.textContent = "";
        viewerShootingTime.hidden = true;
      }

      /* Open */

      viewer.classList.add("is-open");

      document.body.classList.add(
        "gallery-viewer-open"
      );

    });

  });


  /* -------------------------------------------------------
     Close Viewer
     ------------------------------------------------------- */

  const closeViewer = () => {

    viewer.classList.remove("is-open");

    document.body.classList.remove(
      "gallery-viewer-open"
    );

    viewerImage.src = "";

    viewerDescription.textContent = "";

    viewerExif.innerHTML = "";

    viewerShootingTime.textContent = "";

    viewerShootingTime.hidden = true;

  };


  closeButton.addEventListener(
    "click",
    closeViewer
  );


  /* -------------------------------------------------------
     Click Outside Image
     ------------------------------------------------------- */

  viewer.addEventListener("click", (event) => {

    if (event.target === viewer) {

      closeViewer();

    }

  });


  /* -------------------------------------------------------
     ESC Key
     ------------------------------------------------------- */

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

      closeViewer();

    }

  });

});
