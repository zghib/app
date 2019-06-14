<template>
  <div class="file-preview">
    <div v-if="isImage" class="preview image">
      <img v-if="!imgError" ref="image" :src="vUrl" :alt="value.title" @error="imgError = true" />
      <div v-else class="broken-image">
        <v-icon name="broken_image" />
      </div>
    </div>

    <div v-else-if="isVideo" class="preview video">
      <video controls>
        <source :src="url" :type="value.type" />
        I'm sorry; your browser doesn't support HTML5 video in this format.
      </video>
    </div>
    <div v-else-if="isAudio" class="preview audio">
      <audio controls>
        <source :src="url" :type="value.type" />
        I'm sorry; your browser doesn't support HTML5 audio in this format.
      </audio>
    </div>
    <div v-else-if="isYouTube" class="preview embed">
      <iframe
        width="620"
        height="349"
        :src="'https://www.youtube.com/embed/' + value.embed"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    <div v-else-if="isVimeo" class="preview embed">
      <iframe
        width="620"
        height="349"
        :src="
          'https://player.vimeo.com/video/' +
            value.embed +
            '?color=039be5&title=0&byline=0&portrait=0'
        "
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
      ></iframe>
    </div>
    <div v-else class="preview file">{{ fileType }}</div>
    <div class="toolbar">
      <!-- Default Toolbar -->
      <div v-if="!editMode" class="original">
        <div class="main">
          <a v-tooltip="value.title" class="file-link" :href="url" target="_blank">
            <v-icon name="link" />
            <span>{{ value.title }}</span>
          </a>
          <p v-if="subtitle" class="subtitle">
            {{ subtitle }}
          </p>
        </div>

        <v-contextual-menu :options="moreOptions" @click="emitCtxEvent" />
      </div>

      <!-- Image Edit Toolbar -->
      <ul v-if="editMode" class="image-edit">
        <li>
          <div class="image-aspect-ratio">
            <label :for="componentId">
              <v-icon name="image_aspect_ratio" />
              <span>{{ image.cropRatioOptions[image.cropRatio] }}</span>
              <v-icon name="arrow_drop_down" />
              <select :id="componentId" v-model="image.cropRatio" :title="selectRatioTranslation">
                <option
                  v-for="(option, ratioValue) in image.cropRatioOptions"
                  :key="ratioValue"
                  :value="ratioValue"
                >
                  {{ option }}
                </option>
              </select>
            </label>
          </div>
        </li>
        <li>
          <button type="button" title="Discard changes" @click="cancelImageEdit()">
            <v-icon name="not_interested" />
          </button>
          <button type="button" title="Save changes" @click="saveImage()">
            <v-icon name="check_circle" />
          </button>
        </li>
        <li>
          <button type="button" title="Flip horizontally" @click="flipImage()">
            <v-icon name="flip" />
          </button>
          <button type="button" title="Rotate counter-clockwise" @click="rotateImage()">
            <v-icon name="rotate_90_degrees_ccw" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";

export default {
  name: "VFilePreview",
  props: {
    value: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: () => ({})
    },
    editor: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null
    },
    subtitle: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      editMode: null,
      imgError: false,
      image: {
        version: 0, //To prevent the cacheing issue of image
        cropper: null, //cropper instance
        cropRatio: "free", // Aspect ratio set by cropper
        cropRatioOptions: {
          free: "Free",
          original: "Original",
          "1:1": "Square",
          "16:9": "16:9",
          "4:3": "4:3",
          "3:2": "3:2"
        },
        initOptions: {
          background: false,
          viewMode: 1,
          autoCropArea: 1,
          zoomable: false
        }
      }
    };
  },
  computed: {
    componentId() {
      return "file-preview-" + this.$helpers.shortid.generate();
    },
    selectRatioTranslation() {
      return this.$t("select_aspect_ratio");
    },
    isImage() {
      switch (this.value.type) {
        case "image/jpeg":
        case "image/gif":
        case "image/png":
        case "image/svg+xml":
        case "image/webp":
        case "image/bmp":
          return true;
      }
      return false;
    },
    isVideo() {
      switch (this.value.type) {
        case "video/mp4":
        case "video/webm":
        case "video/ogg":
          return true;
      }
      return false;
    },
    isAudio() {
      switch (this.value.type) {
        case "audio/mpeg":
        case "audio/ogg":
        case "audio/wav":
          return true;
      }
      return false;
    },
    isYouTube() {
      return this.value.type === "embed/youtube";
    },
    isVimeo() {
      return this.value.type === "embed/vimeo";
    },
    fileType() {
      return this.value.type.split("/")[1];
    },
    url() {
      return this.value.data.full_url;
    },
    vUrl() {
      /**
       * Timestamp fetches the latest image from server
       * Version helps to refresh the image after crop
       */
      return `${this.url}?v=${this.image.version}&timestamp=${new Date().getTime()}`;
    },
    moreOptions() {
      const moreOptions = _.clone(this.options);

      if (this.editor && this.isImage) {
        moreOptions.editor = {
          text: this.$t("edit"),
          icon: "crop_rotate"
        };
      }

      return moreOptions;
    }
  },
  watch: {
    "image.cropRatio"(newValue) {
      this.setAspectRatio(newValue);
    }
  },
  methods: {
    initImageEdit() {
      this.editMode = "image";
      this.image.show = false;
      const image = this.$refs.image;
      this.image.cropper = new Cropper(image, this.image.initOptions);

      window.addEventListener("keydown", this.escapeEditImage);
    },

    emitCtxEvent(id) {
      if (id === "editor") {
        this.initImageEdit();
      }

      this.$emit(id);
    },

    escapeEditImage(event) {
      if (this.editMode === "image" && event.key === "Escape") {
        this.cancelImageEdit();
        window.removeEventListener("keydown", this.escapeEditImage);
      }
    },

    cancelImageEdit() {
      this.editMode = null;
      this.image.cropRatio = "free";
      this.image.cropper.destroy();
    },

    setAspectRatio(value) {
      let aspectRatio;
      switch (value) {
        case "free": {
          aspectRatio = "free";
          break;
        }
        case "original": {
          aspectRatio = this.image.cropper.getImageData().aspectRatio;
          break;
        }
        default: {
          const values = value.split(":");
          aspectRatio = values[0] / values[1];
          break;
        }
      }
      this.image.cropper.setAspectRatio(aspectRatio);
    },

    flipImage() {
      this.image.cropper.scale(-this.image.cropper.getData().scaleX, 1);
    },

    rotateImage() {
      this.image.cropper.rotate(-90);
      //TODO: Fix the image rotation issue
      /**
       * White rotating the image, the sides are getting cut of
       * due to limitations of the cropper.js plugin
       */
    },

    saveImage() {
      //Running the rabbit
      const isSaving = this.$helpers.shortid.generate();
      this.$store.dispatch("loadingStart", {
        id: isSaving
      });

      //Converting an image to base64
      const imageBase64 = this.image.cropper
        .getCroppedCanvas({
          imageSmoothingQuality: "high"
        })
        .toDataURL(this.value.type);

      //Saving the image via API
      this.$api
        .patch(`/files/${this.value.id}`, {
          data: imageBase64
        })
        .then(() => {
          this.$events.emit("success", {
            notify: "Image updated."
          });
        })
        .catch(err => {
          this.$events.emit("error", {
            notify: "There was an error while saving the image",
            error: err
          });
        })
        .then(() => {
          this.image.version++;
          /**
           * This will wait for new cropped image to load from server
           * & then destroy the cropper instance
           * This prevents flickering between old and new image
           */
          const img = new Image();
          img.src = this.vUrl;
          img.onload = () => {
            this.$store.dispatch("loadingFinished", isSaving);
            this.cancelImageEdit();
          };
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.preview {
  border: var(--input-border-width) solid var(--lighter-gray);
  border-radius: var(--border-radius);
}
.file,
.audio,
.video,
.image {
  width: 100%;
  background-color: var(--lightest-gray);
  text-align: center;
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  overflow: hidden;
  img,
  video {
    margin: 0 auto;
    max-height: 424px;
    width: 100%;
    object-fit: contain;
    max-width: 100%;
    display: block;
  }
  audio {
    margin: 0 auto;
    width: 100%;
    max-width: 100%;
    display: block;
  }
}
.file,
.audio,
.video {
  overflow: hidden;
}
.audio,
.file {
  padding: 80px 40px;
  font-size: 3em;
  text-transform: uppercase;
  font-weight: 300;
  color: var(--lighter-gray);
}
.toolbar {
  padding: 8px 16px;
  background: var(--off-white);
  border: solid var(--lighter-gray);
  border-width: 0 var(--input-border-width) var(--input-border-width);
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  .original {
    display: flex;
    align-items: center;
    justify-content: space-between;

    a {
      color: var(--dark-gray);
      font-size: var(--size-3);
      margin-bottom: -4px;
    }
  }
  .subtitle {
    font-size: var(--size-3);
    color: var(--light-gray);
  }
  .main {
    min-width: 0;
  }
}
.file-link {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
  i {
    margin-right: 6px;
    color: var(--gray);
    transition: var(--fast) var(--transition);
    transition-property: color;
  }
  span {
    margin-right: 10px;
    vertical-align: middle;
  }
  &:hover i {
    color: var(--darker-gray);
  }
}
.image-edit-start {
  margin-left: 10px;
  i {
    color: var(--gray);
  }
}
.image-edit {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  > li {
    flex: 0 0 33.33%;
    text-align: center;
    button {
      color: var(--dark-gray);
      + button {
        margin-left: 10px;
      }
      &:hover {
        color: var(--darkest-gray);
      }
    }
    &:first-child {
      text-align: left;
    }
    &:last-child {
      text-align: right;
    }
  }
}
.image-aspect-ratio {
  position: relative;
  display: inline-flex;
  align-items: center;
  span {
    margin-left: 8px;
  }
  select {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
.menu-toggle {
  width: 16px;
  color: var(--lighter-gray);
  transition: color var(--fast) var(--transition);

  &:hover {
    color: var(--darker-gray);
    transition: none;
  }
}
.broken-image {
  width: 100%;
  padding: 70px 0;
  display: flex;
  justify-content: center;
  align-items: center;

  i {
    color: var(--light-gray);
    font-size: 48px;
  }
}
</style>

<style lang="scss">
.image {
  .cropper-modal {
    background: var(--dark-gray);
  }
  .cropper-point {
    background: #fff;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    opacity: 1;
    box-shadow: rgba(0, 0, 0, 0.2) 0 2px 8px;
    &.point-n {
      top: -5px;
      margin-left: -5px;
    }
    &.point-ne {
      right: -5px;
      top: -5px;
    }
    &.point-e {
      margin-top: -5px;
      right: -5px;
    }
    &.point-se {
      right: -5px;
      bottom: -5px;
    }
    &.point-s {
      bottom: -5px;
      margin-left: -5px;
    }
    &.point-sw {
      left: -5px;
      bottom: -5px;
    }
    &.point-w {
      margin-top: -5px;
      left: -5px;
    }
    &.point-nw {
      left: -5px;
      top: -5px;
    }
  }
  .cropper-dashed {
    border-style: solid;
    border-color: #fff;
    opacity: 0.4;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
  }
  .cropper-line {
    background-color: #000;
    opacity: 0.05;
  }
}
</style>
