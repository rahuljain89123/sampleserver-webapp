import React from 'react'
import Measure from 'react-measure'


class SiteMapRenderer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      img: undefined,

      /**
       * the x and y placement coordinates such that the image
       * would be centered in the canvas at it's current scale.
       */
      centerVals: {
        x: null,
        y: null,
      },

      /**
       * Current coordinates of the image with respect to it's center
       * i.e. (0, 0) => the center of the image is at (0,0)
       */
      x: 0,
      y: 0,

      /**
       * Will be object with form
       *   {
       *    ------ Starting Coordinates of the Click ------
       *     startX,
       *     startY,
       *    ------ Position of Image at the start of the drag -----
       *     posStartX,
       *     posStartY
       *   }

       * drag is null when there is no drag occurring
       */
      drag: null,

      /**
       * Scale of image with respect to it's original size.
       * 1 = full size
       */
      scale: 1,
    }

    this.setImage = this.setImage.bind(this)
    this.drawCanvas = this.drawCanvas.bind(this)
    this.processClick = this.processClick.bind(this)
    this.initDrag = this.initDrag.bind(this)
    this.processDrag = this.processDrag.bind(this)
    this.endDrag = this.endDrag.bind(this)
    this.fitCanvasToContainer = this.fitCanvasToContainer.bind(this)
    this.componentDidUpdate = this.drawCanvas
  }

  /**
   * Loads the SiteMapImage from source and creates an ImageBitmap from it.
   */
  componentDidMount () {
    const img = new Image()
    const setImage = this.setImage

    img.onload = function() {
      createImageBitmap(this).then(setImage)
    }

    img.src = this.props.imageUrl
    this.fitCanvasToContainer()
  }

  fitCanvasToContainer () {
    this.canvasEl.width = this.canvasEl.offsetWidth
    this.canvasEl.height = this.canvasEl.offsetHeight
    this.drawCanvas()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.imageUrl !== this.props.imageUrl) {
      const img = new Image()
      const setImage = this.setImage

      img.onload = function() {
        createImageBitmap(this).then(setImage)
      }

      img.src = nextProps.imageUrl
    }
  }

  /**
   * Takes a loaded img element and stores it into an ImageBitmap, and
   * updates the state with the appropriate x and y coordinate so that the image
   * is centered in the canvas element.
   */
  setImage(img) {
    this.setState({
      img,
      centerVals: {
        x: this.centerVal(img.width, this.canvasEl.width),
        y: this.centerVal(img.height, this.canvasEl.height),
      },
      scale: 1,
    })
  }

  /**
   * @param imgDim {Integer} length of image
   * @param canvasDim {Integer} total length of canvas
   * @return the x or y coordinate such that the image will be centered within the canvas
   */
  centerVal (imgDim, canvasDim, scale = 1) {
    return (canvasDim - imgDim * scale) / 2;
  }

  /**
   * processes a click event by getting the x and y coordinates of
   * the click within the image and calling the Parent's provided
   * callback (this.props.onClick)
   */
  processClick (evt) {
    const {
      x,
      y,
      img,
      scale,
      centerVals: {
        x: centerX,
        y: centerY
      }
    } = this.state
    const divOffsets = evt.target.getBoundingClientRect()

    const clickX = evt.clientX - divOffsets.left,
          clickY = evt.clientY - divOffsets.top,
          imgX   = x + centerX,
          imgY   = y + centerY,
          xpos   = (clickX - imgX)/scale,
          ypos   = (clickY - imgY)/scale

    // Check that click is within the bounds of the map
    if ( clickX < imgX ||
          clickX > (imgX + img.width * scale) ||
          clickY < imgY ||
          clickY > (imgY + img.height * scale)) {
      return
    }

    this.props.onClick(xpos, ypos, evt)
  }

  /**
   * Changes the scale the image is being rendered at,
   * also updates the CenterVals given the new scale
   *
   * @param increment {Float} the value by which to increment the scale
   */
  scaleBy (increment) {
    if (this.state.scale + increment < 0.2) { return } //don't decrement scale below 0
    this.setState((prevState) => {
      const newScale = prevState.scale + increment
      return {
        scale: newScale,
        centerVals: {
          x: this.centerVal(prevState.img.width, this.canvasEl.width, newScale),
          y: this.centerVal(prevState.img.height, this.canvasEl.height, newScale),
        }
      }
    })
  }

  /**
   * Begins the dragging event so the image can be moved around in the container
   * Stores start position of the image and start position of the mouse in state.drag
   */
  initDrag (evt) {
    const { screenX, screenY, button } = evt
    const { x, y } = this.state


    // Don't do anything if it's not a left click
    if (button === 2) { this.processClick(evt) }
    if (button !== 0) { return }

    this.setState({
      drag: {
        startX: screenX,
        startY: screenY,
        posStartX: x,
        posStartY: y,
      }
    })
  }

  /**
   * Moves the image as it is being dragged in the container
   */
  processDrag (evt) {
    const { screenX, screenY } = evt
    if (!this.state.drag) { return } // Return if not dragging

    this.setState({
      x: (screenX - this.state.drag.startX) + this.state.drag.posStartX,
      y: (screenY - this.state.drag.startY) + this.state.drag.posStartY,
    })
  }

  /**
   * Processes the end of the drag
   */
  endDrag (evt) {
    const { screenX, screenY } = evt
    const drag = null
    // Don't do anything if it's not a drag
    if (!this.state.drag) { return }

    // If they moved the mouse less than 10 pixels, fire a click event, clear the drag
    if (Math.abs(this.state.drag.startX - screenX) < 10) {
      this.processClick(evt)
      this.setState({ drag })
    } else {
      // Otherwise drag the image
      const newPosX = (screenX - this.state.drag.startX) + this.state.drag.posStartX
      const newPosY = (screenY - this.state.drag.startY) + this.state.drag.posStartY

      this.setState({
        drag,
        x: newPosX,
        y: newPosY
      })
    }
  }

  drawCanvas () {
    const ctx = this.canvasEl.getContext('2d')
    const { x, y, scale, img, centerVals: { x: centerX, y: centerY } } = this.state
    if (!img) { return } // break if the image hasn't been loaded yet.

    ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height)

    ctx.drawImage(img, centerX + x, centerY + y, img.width * scale, img.height * scale)
    this.drawWells(ctx)
  }

  drawWells (ctx) {
    // if (this.props.wells.size) { debugger }
    if (!this.props.wells) { return }
    this.props.wells.forEach((well) => { this.drawWellMarker(well, ctx) })
  }

  drawWellMarker(well, ctx) {
    const { x: imgX, y: imgY, scale, centerVals: { x: centerX, y: centerY } } = this.state

    const x = well.get('xpos') * scale + (centerX + imgX),
          y = well.get('ypos') * scale + (centerY + imgY)


    this.props.drawWellMarker(well, ctx, { x, y, scale })
  }

  render () {
    const {
      initDrag,
      processDrag,
      endDrag,
      props: { imageUrl },
      state: { scale }
    } = this

    const overlayStyles = {
      width: this.props.width || `100%`,
      height: this.props.height || `100%`,
    }

    return (
      <div className='site-map-image' style={overlayStyles}>
        <div className="zoom-controls">
          <i className="material-icons" onClick={(e) => this.scaleBy(0.2)}>add</i>
          <div className="zoom-level">{parseInt(scale * 100)}%</div>
          <i className="material-icons" onClick={(e) => this.scaleBy(-0.2)}>remove</i>
        </div>
        <div className='img-and-canvas-overlay' style={overlayStyles}>
          <Measure onMeasure={this.fitCanvasToContainer}>
            <canvas
              style={overlayStyles}
              ref={(canvas) => {this.canvasEl = canvas}}
              onMouseDown={initDrag}
              onMouseMove={processDrag}
              onMouseUp={endDrag}
              onContextMenu={(e) => {
                e.preventDefault()
                return false
              }}
            />
          </Measure>
        </div>
      </div>
    )
  }
}

export default SiteMapRenderer
