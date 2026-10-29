import AppKit
import CoreText
import Foundation
import ImageIO

let width = 1920
let height = 1080
let frameRate = 30
let frameCount = 300

func color(_ hex: UInt32, _ alpha: CGFloat = 1) -> CGColor {
  CGColor(red: CGFloat((hex >> 16) & 255) / 255,
          green: CGFloat((hex >> 8) & 255) / 255,
          blue: CGFloat(hex & 255) / 255, alpha: alpha)
}

let ink = color(0x141311)
let accent = color(0xff4d2e)
let burntOrange = color(0xbd5b1c)
let blocks: [(CGFloat, CGFloat, CGFloat, CGFloat, UInt32)] = [
  (-590, -85, 145, 80, 0xe5caa7), (-170, -255, 180, 85, 0xc5d9b6),
  (180, -275, 155, 90, 0xdac8ed), (620, -115, 120, 85, 0xf6d78c),
  (-670, 100, 125, 85, 0xdac8ed), (-190, 240, 170, 85, 0xf3b7a7),
  (230, 230, 160, 90, 0xbcd9df), (680, 215, 115, 85, 0xc5d9b6),
]
func point(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: x, y: y) }
let roads: [[CGPoint]] = [
  [point(-730, -245), point(-480, -150), point(-210, -205), point(90, -110), point(360, -165), point(700, -75)],
  [point(-700, 215), point(-440, 120), point(-150, 175), point(140, 95), point(430, 155), point(710, 80)],
  [point(-570, -295), point(-455, -45), point(-325, 265)],
  [point(-20, -285), point(55, -65), point(120, 275)],
  [point(520, -290), point(405, -15), point(570, 280)],
]
let river: [CGPoint] = [point(-740, 20), point(-510, -5), point(-280, 40), point(-40, 15), point(190, 55), point(430, 20), point(720, 45)]

func clamp(_ value: Double) -> CGFloat { CGFloat(max(0, min(1, value))) }
func easeOut(_ value: Double) -> CGFloat {
  let t = 1 - clamp(value)
  return 1 - t * t * t
}
func easeOutBack(_ value: Double) -> CGFloat {
  let t = clamp(value) - 1
  return 1 + 2.70158 * t * t * t + 1.70158 * t * t
}

func rounded(_ context: CGContext, _ rect: CGRect, radius: CGFloat, fill: CGColor, stroke: CGColor? = nil, lineWidth: CGFloat = 0) {
  let path = CGPath(roundedRect: rect, cornerWidth: radius, cornerHeight: radius, transform: nil)
  context.addPath(path)
  context.setFillColor(fill)
  context.fillPath()
  if let stroke {
    context.addPath(path)
    context.setStrokeColor(stroke)
    context.setLineWidth(lineWidth)
    context.strokePath()
  }
}

func text(_ context: CGContext, _ value: String, x: CGFloat, y: CGFloat, size: CGFloat, foreground: CGColor) {
  let font = CTFontCreateWithName("Arial-Black" as CFString, size, nil)
  let attributes: [NSAttributedString.Key: Any] = [
    NSAttributedString.Key(kCTFontAttributeName as String): font,
    NSAttributedString.Key(kCTForegroundColorAttributeName as String): foreground,
  ]
  let line = CTLineCreateWithAttributedString(NSAttributedString(string: value, attributes: attributes))
  let lineWidth = CGFloat(CTLineGetTypographicBounds(line, nil, nil, nil))
  context.saveGState()
  context.translateBy(x: x, y: y)
  context.scaleBy(x: 1, y: -1)
  context.textPosition = CGPoint(x: -lineWidth / 2, y: -size * 0.34)
  CTLineDraw(line, context)
  context.restoreGState()
}

func polyline(_ context: CGContext, _ points: [CGPoint], stroke: CGColor, lineWidth: CGFloat, opacity: CGFloat = 1) {
  guard let first = points.first else { return }
  context.saveGState()
  context.setAlpha(opacity)
  context.setStrokeColor(stroke)
  context.setLineWidth(lineWidth)
  context.setLineCap(.round)
  context.setLineJoin(.round)
  context.move(to: first)
  for point in points.dropFirst() { context.addLine(to: point) }
  context.strokePath()
  context.restoreGState()
}

func drawPin(_ context: CGContext, center: CGPoint, fill: CGColor, title: String, subtitle: String,
             subtitleColor: CGColor, restaurant: Bool, appear: CGFloat, scale: CGFloat, halo: CGFloat) {
  if appear <= 0 { return }
  context.saveGState()
  context.setAlpha(appear)
  context.translateBy(x: center.x, y: center.y)
  context.scaleBy(x: scale, y: scale)
  if halo > 0 {
    context.saveGState()
    context.setAlpha(halo)
    context.setStrokeColor(fill)
    context.setLineWidth(8)
    context.strokeEllipse(in: CGRect(x: -75, y: -75, width: 150, height: 150))
    context.restoreGState()
  }
  context.setFillColor(color(0x141311, 0.14))
  context.fillEllipse(in: CGRect(x: -40, y: -38, width: 92, height: 92))
  context.setFillColor(fill)
  context.fillEllipse(in: CGRect(x: -46, y: -46, width: 92, height: 92))
  context.setStrokeColor(ink)
  context.setLineWidth(7)
  context.strokeEllipse(in: CGRect(x: -46, y: -46, width: 92, height: 92))
  if restaurant {
    rounded(context, CGRect(x: -22.5, y: -8.5, width: 45, height: 29), radius: 5, fill: color(0xffffff))
    rounded(context, CGRect(x: -26, y: -20.5, width: 52, height: 13), radius: 4, fill: color(0xffffff))
  } else {
    context.setFillColor(color(0xffffff))
    context.fillEllipse(in: CGRect(x: -9, y: -9, width: 18, height: 18))
  }
  let cardWidth: CGFloat = restaurant ? 450 : 430
  rounded(context, CGRect(x: -cardWidth / 2 + 8, y: 56, width: cardWidth, height: 94), radius: 22, fill: color(0x141311, 0.13))
  rounded(context, CGRect(x: -cardWidth / 2, y: 48, width: cardWidth, height: 94), radius: 22, fill: color(0xffffff), stroke: ink, lineWidth: 7)
  text(context, title, x: 0, y: 79, size: 48, foreground: ink)
  text(context, subtitle, x: 0, y: 115, size: 21, foreground: subtitleColor)
  context.restoreGState()
}

func drawFrame(_ context: CGContext, at seconds: Double) {
  context.saveGState()
  context.translateBy(x: 0, y: CGFloat(height))
  context.scaleBy(x: 1, y: -1)
  context.setFillColor(color(0xf5f5f5))
  context.fill(CGRect(x: 0, y: 0, width: width, height: height))
  text(context, "LONDON", x: 960, y: 110, size: 78, foreground: ink)
  polyline(context, [CGPoint(x: 880, y: 172), CGPoint(x: 1040, y: 172)], stroke: accent, lineWidth: 10)

  let mapOpacity = clamp(seconds / 0.55)
  let mapScale = 0.96 + 0.04 * easeOut(seconds / 0.55)
  context.saveGState()
  context.setAlpha(mapOpacity)
  context.translateBy(x: 960, y: 595)
  context.scaleBy(x: mapScale, y: mapScale)
  rounded(context, CGRect(x: -808, y: -381, width: 1640, height: 790), radius: 36, fill: color(0x141311, 0.12))
  rounded(context, CGRect(x: -820, y: -395, width: 1640, height: 790), radius: 36, fill: color(0xffffff), stroke: ink, lineWidth: 8)
  for block in blocks {
    rounded(context, CGRect(x: block.0 - block.2 / 2, y: block.1 - block.3 / 2,
                            width: block.2, height: block.3), radius: 22,
            fill: color(block.4, 0.42))
  }
  for road in roads { polyline(context, road, stroke: ink, lineWidth: 8, opacity: 0.12) }
  polyline(context, river, stroke: color(0xbcd9df), lineWidth: 48, opacity: 0.75)

  let compassOpacity = clamp((seconds - 5.6) / 0.4)
  if compassOpacity > 0 {
    context.saveGState()
    context.setAlpha(compassOpacity)
    text(context, "N", x: 690, y: -315, size: 34, foreground: ink)
    polyline(context, [CGPoint(x: 690, y: -273), CGPoint(x: 690, y: -293)], stroke: burntOrange, lineWidth: 8)
    context.setFillColor(burntOrange)
    context.move(to: CGPoint(x: 690, y: -304))
    context.addLine(to: CGPoint(x: 680, y: -284))
    context.addLine(to: CGPoint(x: 700, y: -284))
    context.closePath()
    context.fillPath()
    context.restoreGState()
  }

  drawPin(context, center: CGPoint(x: -380, y: 210), fill: accent,
          title: "BRIXTON", subtitle: "YOU ARE HERE", subtitleColor: accent,
          restaurant: false, appear: clamp((seconds - 0.65) / 0.3),
          scale: 0.6 + 0.4 * easeOutBack((seconds - 0.65) / 0.55),
          halo: 0.55 * clamp((seconds - 5.6) / 0.45))
  drawPin(context, center: CGPoint(x: 430, y: -260), fill: burntOrange,
          title: "ENFIELD", subtitle: "NIGERIAN RESTAURANT", subtitleColor: burntOrange,
          restaurant: true, appear: clamp((seconds - 4.05) / 0.35),
          scale: 0.6 + 0.4 * easeOutBack((seconds - 4.05) / 0.6),
          halo: 0.55 * clamp((seconds - 5.6) / 0.45))
  context.restoreGState()

  let messageOpacity = clamp((seconds - 1.25) / 0.3) * (1 - clamp((seconds - 3.6) / 0.35))
  if messageOpacity > 0 {
    context.saveGState()
    context.setAlpha(messageOpacity)
    context.translateBy(x: 590, y: 320)
    let scale = 0.85 + 0.15 * easeOutBack((seconds - 1.25) / 0.5)
    context.scaleBy(x: scale, y: scale)
    rounded(context, CGRect(x: -330, y: -73, width: 680, height: 170), radius: 30, fill: color(0x141311, 0.13))
    rounded(context, CGRect(x: -340, y: -85, width: 680, height: 170), radius: 30, fill: color(0xffffff), stroke: ink, lineWidth: 8)
    rounded(context, CGRect(x: -306, y: -73, width: 122, height: 34), radius: 10, fill: accent)
    text(context, "MATE", x: -245, y: -56, size: 21, foreground: color(0xffffff))
    text(context, "Best Nigerian restaurant", x: 0, y: -7, size: 41, foreground: ink)
    text(context, "in town!", x: 0, y: 45, size: 41, foreground: ink)
    context.restoreGState()
  }
  context.restoreGState()
}

let byteCount = width * height * 4
let pixels = UnsafeMutablePointer<UInt8>.allocate(capacity: byteCount)
defer { pixels.deallocate() }
let bitmapInfo = CGBitmapInfo.byteOrder32Little.rawValue | CGImageAlphaInfo.premultipliedFirst.rawValue
guard let context = CGContext(data: pixels, width: width, height: height, bitsPerComponent: 8,
                              bytesPerRow: width * 4, space: CGColorSpaceCreateDeviceRGB(),
                              bitmapInfo: bitmapInfo) else {
  fatalError("Could not create drawing context")
}

if CommandLine.arguments.count == 3 && CommandLine.arguments[1] == "--still" {
  drawFrame(context, at: Double(CommandLine.arguments[2]) ?? 0)
  let data = NSMutableData()
  guard let image = context.makeImage(),
        let destination = CGImageDestinationCreateWithData(data, "public.png" as CFString, 1, nil) else {
    fatalError("Could not create PNG")
  }
  CGImageDestinationAddImage(destination, image, nil)
  CGImageDestinationFinalize(destination)
  FileHandle.standardOutput.write(data as Data)
} else {
  for frame in 0..<frameCount {
    drawFrame(context, at: Double(frame) / Double(frameRate))
    FileHandle.standardOutput.write(Data(bytes: pixels, count: byteCount))
  }
}
