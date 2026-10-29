import AppKit
import CoreText
import Foundation
import ImageIO

let width = 1920
let height = 1080
let frameRate = 30
let duration = 13

struct Person {
  let name: String
  let listY: CGFloat
  let x: CGFloat
  let y: CGFloat
  let color: CGColor
}

func color(_ hex: UInt32, _ alpha: CGFloat = 1) -> CGColor {
  CGColor(
    red: CGFloat((hex >> 16) & 255) / 255,
    green: CGFloat((hex >> 8) & 255) / 255,
    blue: CGFloat(hex & 255) / 255,
    alpha: alpha
  )
}

let ink = color(0x141311)
let accent = color(0xff4d2e)
let people = [
  Person(name: "Daniel", listY: 305, x: 410, y: 320, color: accent),
  Person(name: "Sam", listY: 377, x: 710, y: 560, color: color(0xbcd9df)),
  Person(name: "Femi", listY: 449, x: 1150, y: 290, color: color(0xf6d78c)),
  Person(name: "Priya", listY: 521, x: 1550, y: 340, color: color(0xdac8ed)),
  Person(name: "Margaret", listY: 593, x: 1460, y: 800, color: color(0xc5d9b6)),
  Person(name: "Jo", listY: 665, x: 340, y: 810, color: color(0xf3b7a7)),
  Person(name: "Emmanuel", listY: 737, x: 800, y: 760, color: color(0xb7c9ed)),
  Person(name: "Mia", listY: 809, x: 1090, y: 580, color: color(0xe5caa7)),
]
let edges = [(0, 1), (7, 2), (5, 6), (0, 2), (3, 4), (1, 7), (2, 6), (0, 5), (7, 3), (6, 4), (1, 6), (7, 4)]

func clamp(_ value: Double) -> CGFloat { CGFloat(max(0, min(1, value))) }
func ease(_ value: Double) -> CGFloat {
  let t = clamp(value)
  return t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2
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

func drawFrame(_ context: CGContext, at seconds: Double) {
  context.saveGState()
  context.translateBy(x: 0, y: CGFloat(height))
  context.scaleBy(x: 1, y: -1)
  context.setFillColor(color(0xf5f5f5))
  context.fill(CGRect(x: 0, y: 0, width: width, height: height))

  text(context, "FRIENDSHIP GROUP", x: 960, y: 120, size: 78, foreground: ink)
  context.setStrokeColor(accent)
  context.setLineWidth(10)
  context.setLineCap(.round)
  context.move(to: CGPoint(x: 880, y: 181))
  context.addLine(to: CGPoint(x: 1040, y: 181))
  context.strokePath()

  let paperOpacity = clamp(seconds / 0.35) * (1 - ease((seconds - 3) / 0.55))
  if paperOpacity > 0 {
    rounded(context, CGRect(x: 673, y: 240, width: 600, height: 710), radius: 24, fill: color(0x141311, 0.12 * paperOpacity))
    rounded(context, CGRect(x: 660, y: 225, width: 600, height: 710), radius: 24, fill: color(0xffffff, paperOpacity), stroke: color(0x141311, paperOpacity), lineWidth: 8)
    rounded(context, CGRect(x: 718, y: 285, width: 46, height: 22), radius: 6, fill: color(0xff4d2e, paperOpacity))
    context.setLineWidth(4)
    context.setLineCap(.round)
    context.setStrokeColor(color(0x141311, 0.1 * paperOpacity))
    for person in people {
      context.move(to: CGPoint(x: 748, y: person.listY))
      context.addLine(to: CGPoint(x: 1172, y: person.listY))
      context.strokePath()
    }
  }

  for (index, edge) in edges.enumerated() {
    let progress = ease((seconds - 9.5 - Double(index) * 0.22) / 0.5)
    if progress == 0 { continue }
    let from = people[edge.0]
    let to = people[edge.1]
    context.setStrokeColor(ink)
    context.setLineWidth(9)
    context.setLineCap(.round)
    let dx = to.x - from.x
    let dy = to.y - from.y
    let distance = hypot(dx, dy)
    let offsetX = dx / distance * 90
    let offsetY = dy / distance * 90
    let start = CGPoint(x: from.x + offsetX, y: from.y + offsetY)
    let end = CGPoint(x: to.x - offsetX, y: to.y - offsetY)
    context.move(to: start)
    context.addLine(to: CGPoint(x: start.x + (end.x - start.x) * progress, y: start.y + (end.y - start.y) * progress))
    context.strokePath()
  }

  for (index, person) in people.enumerated() {
    let spread = ease((seconds - 3 - Double(index) * 0.1) / 1.25)
    let appear = clamp((seconds - Double(index) * 0.08) / 0.25)
    if appear == 0 { continue }
    let x = 960 + (person.x - 960) * spread
    let y = person.listY + (person.y - person.listY) * spread
    let ring = ease((seconds - 7 - Double(index) * 0.28) / 0.5)
    if ring > 0 {
      let radius = 90 * (0.72 + 0.28 * ring)
      let rect = CGRect(x: x - radius, y: y - radius, width: 2 * radius, height: 2 * radius)
      let shadow = rect.offsetBy(dx: 9, dy: 11)
      context.setFillColor(color(0x141311, 0.13 * ring))
      context.fillEllipse(in: shadow)
      context.setFillColor(person.color)
      context.fillEllipse(in: rect)
      context.setStrokeColor(ink)
      context.setLineWidth(8)
      context.strokeEllipse(in: rect)
    }
    context.saveGState()
    context.setAlpha(appear)
    let graphNameSize: CGFloat = person.name == "Emmanuel" ? 28 : person.name.count >= 9 ? 27 : person.name.count >= 8 ? 32 : person.name.count >= 6 ? 44 : 54
    let nameSize = 54 + (graphNameSize - 54) * spread
    text(context, person.name, x: x, y: y, size: nameSize, foreground: ink)
    context.restoreGState()
  }
  context.restoreGState()
}

let byteCount = width * height * 4
let pixels = UnsafeMutablePointer<UInt8>.allocate(capacity: byteCount)
defer { pixels.deallocate() }
let bitmapInfo = CGBitmapInfo.byteOrder32Little.rawValue | CGImageAlphaInfo.premultipliedFirst.rawValue
guard let context = CGContext(data: pixels, width: width, height: height, bitsPerComponent: 8, bytesPerRow: width * 4, space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: bitmapInfo) else {
  fatalError("Could not create drawing context")
}

if CommandLine.arguments.count == 3 && CommandLine.arguments[1] == "--still" {
  let seconds = Double(CommandLine.arguments[2]) ?? 0
  drawFrame(context, at: seconds)
  let data = NSMutableData()
  guard let image = context.makeImage(), let destination = CGImageDestinationCreateWithData(data, "public.png" as CFString, 1, nil) else {
    fatalError("Could not create PNG")
  }
  CGImageDestinationAddImage(destination, image, nil)
  CGImageDestinationFinalize(destination)
  FileHandle.standardOutput.write(data as Data)
} else {
  for frame in 0..<(duration * frameRate) {
    drawFrame(context, at: Double(frame) / Double(frameRate))
    FileHandle.standardOutput.write(Data(bytes: pixels, count: byteCount))
  }
}
