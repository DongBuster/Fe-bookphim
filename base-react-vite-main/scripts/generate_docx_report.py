# -*- coding: utf-8 -*-
"""
Script tạo tài liệu Báo cáo đồ án môn học Xây dựng Website hoàn chỉnh:
Tên đề tài: PHIMBOOK - Hệ thống đặt vé xem phim trực tuyến tiêu chuẩn quốc tế
Tác giả: Nguyễn Thành Đông (DongBuster)
"""

import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    """Đặt màu nền cho ô bảng"""
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Đặt đệm (padding) trong ô bảng"""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def style_table(table, col_widths=None):
    """Thiết lập đường viền và canh lề chuẩn cho bảng biểu"""
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>\n'
        f'  <w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>\n'
        f'  <w:bottom w:val="single" w:sz="8" w:space="0" w:color="94A3B8"/>\n'
        f'  <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>\n'
        f'  <w:insideV w:val="none"/>\n'
        f'  <w:left w:val="none"/>\n'
        f'  <w:right w:val="none"/>\n'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)
    
    # Định dạng header row
    hdr_cells = table.rows[0].cells
    for cell in hdr_cells:
        set_cell_background(cell, "1E293B") # Nền xanh đen sang trọng
        set_cell_margins(cell, top=140, bottom=140, left=140, right=140)
        for p in cell.paragraphs:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in p.runs:
                run.font.bold = True
                run.font.color.rgb = RGBColor(255, 255, 255)
                run.font.size = Pt(10.5)

    # Định dạng các dòng dữ liệu
    for i, row in enumerate(table.rows[1:]):
        bg = "F8FAFC" if i % 2 == 1 else "FFFFFF"
        for cell in row.cells:
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            for p in cell.paragraphs:
                for run in p.runs:
                    run.font.size = Pt(10)
                    run.font.color.rgb = RGBColor(30, 41, 59)

    # Đặt độ rộng cột nếu có
    if col_widths:
        for row in table.rows:
            for idx, width in enumerate(col_widths):
                if idx < len(row.cells):
                    row.cells[idx].width = width

def add_callout(doc, text, title="LƯU Ý QUAN TRỌNG"):
    """Thêm hộp ghi chú / callout sang trọng"""
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    set_cell_background(cell, "F1F5F9")
    set_cell_margins(cell, top=150, bottom=150, left=200, right=150)
    
    # Border trái màu đỏ rạp Crimson Red (#FF535A)
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>\n'
        f'  <w:left w:val="single" w:sz="24" w:space="0" w:color="FF535A"/>\n'
        f'  <w:top w:val="none"/>\n'
        f'  <w:right w:val="none"/>\n'
        f'  <w:bottom w:val="none"/>\n'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    r_title = p.add_run(f"📌 {title}: ")
    r_title.bold = True
    r_title.font.color.rgb = RGBColor(190, 24, 93)
    r_title.font.size = Pt(10.5)
    
    r_text = p.add_run(text)
    r_text.italic = True
    r_text.font.size = Pt(10)
    r_text.font.color.rgb = RGBColor(51, 65, 85)
    
    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(4)
    p_after.paragraph_format.space_after = Pt(4)

def add_figure(doc, img_rel_path, caption_text, width=Inches(6.0)):
    """Chèn hình ảnh minh họa kèm chú thích chuẩn học thuật"""
    full_path = os.path.join(os.getcwd(), img_rel_path)
    if os.path.exists(full_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(4)
        run_img = p_img.add_run()
        run_img.add_picture(full_path, width=width)
        
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(2)
        p_cap.paragraph_format.space_after = Pt(12)
        run_cap = p_cap.add_run(caption_text)
        run_cap.italic = True
        run_cap.font.size = Pt(10)
        run_cap.font.bold = True
        run_cap.font.color.rgb = RGBColor(71, 85, 105)
    else:
        p_err = doc.add_paragraph(f"[Hình ảnh chưa tải: {img_rel_path}]")
        p_err.alignment = WD_ALIGN_PARAGRAPH.CENTER

def setup_page_footer(section):
    """Thiết lập đánh số trang chuyên nghiệp ở Footer (Trang X)"""
    footer = section.footer
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = p.add_run("Trang ")
    run.font.name = "Times New Roman"
    run.font.size = Pt(10)
    run.font.color.rgb = RGBColor(100, 116, 139)
    
    # Mã trường PAGE trong Word
    fldChar1 = parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w'))
    instrText = parse_xml(r'<w:instrText %s xml:space="preserve"> PAGE </w:instrText>' % nsdecls('w'))
    fldChar2 = parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w'))
    fldChar3 = parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w'))
    run_page = p.add_run()
    run_page.font.name = "Times New Roman"
    run_page.font.size = Pt(10)
    run_page.font.bold = True
    run_page.font.color.rgb = RGBColor(71, 85, 105)
    run_page._r.append(fldChar1)
    run_page._r.append(instrText)
    run_page._r.append(fldChar2)
    run_page._r.append(fldChar3)

def add_toc_item(doc, title, page_str, level=1):
    """Thêm một mục vào bảng Mục Lục kèm tab stop và dot leader (..... Trang X)"""
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(3 if level == 1 else 1)
    p.paragraph_format.space_after = Pt(3 if level == 1 else 1)
    if level == 2:
        p.paragraph_format.left_indent = Inches(0.25)
    elif level == 3:
        p.paragraph_format.left_indent = Inches(0.45)

    pPr = p._p.get_or_add_pPr()
    # Tab stop căn lề phải với dấu chấm kết nối dot leader
    tabs = parse_xml(f'<w:tabs {nsdecls("w")}><w:tab w:val="right" w:leader="dot" w:pos="9070"/></w:tabs>')
    pPr.append(tabs)

    r_title = p.add_run(title)
    r_title.font.name = "Times New Roman"
    r_title.font.size = Pt(11 if level == 1 else 10)
    if level == 1:
        r_title.font.bold = True
        r_title.font.color.rgb = RGBColor(15, 23, 42)
    else:
        r_title.font.color.rgb = RGBColor(51, 65, 85)

    p.add_run('\t')
    r_page = p.add_run(str(page_str))
    r_page.font.name = "Times New Roman"
    r_page.font.size = Pt(10)
    if level == 1:
        r_page.font.bold = True
        r_page.font.color.rgb = RGBColor(15, 23, 42)
    else:
        r_page.font.color.rgb = RGBColor(100, 116, 139)

def build_docx_report():
    doc = docx.Document()
    
    # Cấu hình lề trang theo tiêu chuẩn đồ án tốt nghiệp / đồ án môn học
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.79)     # 2.0 cm
        section.bottom_margin = Inches(0.79)  # 2.0 cm
        section.left_margin = Inches(1.18)    # 3.0 cm
        section.right_margin = Inches(0.79)   # 2.0 cm
        section.different_first_page_header_footer = True
        setup_page_footer(section)

    # Kích hoạt tự động cập nhật trường khi mở Word
    element = parse_xml(f'<w:updateFields {nsdecls("w")} w:val="true"/>')
    doc.settings.element.append(element)

    # Thiết lập style mặc định
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Times New Roman'
    style_normal.font.size = Pt(13)
    style_normal.font.color.rgb = RGBColor(30, 41, 59)
    style_normal.paragraph_format.line_spacing = 1.3
    style_normal.paragraph_format.space_after = Pt(6)

    # ==========================================
    # TRANG BÌA
    # ==========================================
    p_b1 = doc.add_paragraph()
    p_b1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_b1.paragraph_format.space_before = Pt(0)
    p_b1.paragraph_format.space_after = Pt(2)
    r = p_b1.add_run("BỘ GIÁO DỤC VÀ ĐÀO TẠO\nTRƯỜNG ĐẠI HỌC CÔNG NGHỆ\nKHOA CÔNG NGHỆ THÔNG TIN\nBỘ MÔN CÔNG NGHỆ PHẦN MỀM")
    r.font.bold = True
    r.font.size = Pt(12)
    r.font.color.rgb = RGBColor(15, 23, 42)

    p_line = doc.add_paragraph()
    p_line.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_line.paragraph_format.space_after = Pt(40)
    r = p_line.add_run("-----------------------------------------------")
    r.font.bold = True

    p_b2 = doc.add_paragraph()
    p_b2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_b2.paragraph_format.space_after = Pt(12)
    r = p_b2.add_run("BÁO CÁO ĐỒ ÁN MÔN HỌC\nXÂY DỰNG WEBSITE")
    r.font.bold = True
    r.font.size = Pt(17)
    r.font.color.rgb = RGBColor(15, 23, 42)

    p_b3 = doc.add_paragraph()
    p_b3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_b3.paragraph_format.space_after = Pt(20)
    r = p_b3.add_run("ĐỀ TÀI:")
    r.font.bold = True
    r.font.size = Pt(13)
    r.font.color.rgb = RGBColor(100, 116, 139)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(50)
    r = p_title.add_run("XÂY DỰNG HỆ THỐNG ĐẶT VÉ XEM PHIM TRỰC TUYẾN\nTIÊU CHUẨN QUỐC TẾ (PHIMBOOK - CINEMATIC LOUNGE)\nTÍCH HỢP TRÍ TUỆ NHÂN TẠO VÀ TƯƠNG TÁC MẠNG XÃ HỘI")
    r.font.bold = True
    r.font.size = Pt(15.5)
    r.font.color.rgb = RGBColor(185, 28, 28) # Màu đỏ sang trọng

    # Bảng thông tin sinh viên và giáo viên hướng dẫn
    info_table = doc.add_table(rows=5, cols=2)
    info_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    info_data = [
        ("Giảng viên hướng dẫn:", "TS. Nguyễn Văn Hướng"),
        ("Sinh viên thực hiện:", "Nguyễn Thành Đông (DongBuster)"),
        ("Mã số sinh viên:", "B21DCCN001"),
        ("Lớp chuyên ngành:", "D21CNTT01 - Kỹ thuật Phần mềm"),
        ("Khóa học:", "2021 - 2026")
    ]
    for row_idx, (label, val) in enumerate(info_data):
        c1, c2 = info_table.rows[row_idx].cells
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(2)
        r1 = p1.add_run(label)
        r1.font.bold = True
        r1.font.size = Pt(12)
        
        p2 = c2.paragraphs[0]
        p2.paragraph_format.space_after = Pt(2)
        r2 = p2.add_run(val)
        r2.font.size = Pt(12)
        c1.width = Inches(2.2)
        c2.width = Inches(3.8)

    p_bottom = doc.add_paragraph()
    p_bottom.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_bottom.paragraph_format.space_before = Pt(80)
    r = p_bottom.add_run("HÀ NỘI, THÁNG 11 NĂM 2026")
    r.font.bold = True
    r.font.size = Pt(12)

    doc.add_page_break()

    # ==========================================
    # LỜI CẢM ƠN & CAM ĐOAN
    # ==========================================
    p_ack = doc.add_heading("LỜI CẢM ƠN", level=1)
    p_ack.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ack.runs[0].font.color.rgb = RGBColor(15, 23, 42)
    
    doc.add_paragraph(
        "Trước hết, em xin gửi lời cảm ơn chân thành và sâu sắc nhất tới các Thầy, Cô giáo trong "
        "Khoa Công nghệ Thông tin - Trường Đại học Công nghệ đã tận tình truyền đạt những tri thức quý báu, "
        "nền tảng lý thuyết vững vàng và rèn luyện tư duy kỹ thuật chuyên môn trong suốt quá trình học tập "
        "môn học Xây dựng Website / Phát triển Ứng dụng Web nâng cao."
    )
    doc.add_paragraph(
        "Đặc biệt, em xin bày tỏ lòng biết ơn sâu sắc đến TS. Nguyễn Văn Hướng, người đã trực tiếp định hướng "
        "phương pháp tiếp cận kiến trúc Clean Architecture, gợi mở những ý tưởng đổi mới về trải nghiệm người dùng hiện đại, "
        "và đóng góp nhiều ý kiến chuyên môn sắc bén giúp em hoàn thiện đồ án này."
    )
    doc.add_paragraph(
        "Mặc dù đã nỗ lực vận dụng các kiến thức chuyên ngành và công nghệ mới nhất để giải quyết các bài toán kỹ thuật thực tế, "
        "đồ án khó tránh khỏi những thiếu sót nhất định. Em rất mong nhận được những nhận xét, góp ý quý báu của Quý Thầy Cô "
        "trong Hội đồng chấm đồ án để sản phẩm ngày càng hoàn thiện hơn nữa."
    )
    p_ack_end = doc.add_paragraph("Em xin chân thành cảm ơn!")
    p_ack_end.runs[0].italic = True

    doc.add_paragraph()
    p_pledge = doc.add_heading("LỜI CAM ĐOAN", level=1)
    p_pledge.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_pledge.runs[0].font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph(
        "Em xin cam đoan rằng đồ án với đề tài \"Xây dựng hệ thống đặt vé xem phim trực tuyến tiêu chuẩn quốc tế "
        "(PHIMBOOK - Cinematic Lounge)\" là công trình nghiên cứu và phát triển độc lập do chính em thực hiện dưới "
        "sự định hướng của Giảng viên hướng dẫn. Toàn bộ các giải pháp kiến trúc, mã nguồn lập trình, cấu trúc cơ sở dữ liệu "
        "và tài liệu báo cáo đều được xây dựng trung thực, minh bạch, không sao chép trái phép bất kỳ sản phẩm nào khác."
    )
    doc.add_paragraph(
        "Các số liệu, trích dẫn, sơ đồ thiết kế và ảnh chụp màn hình trong báo cáo này đều phản ánh trung thực kết quả cài đặt "
        "thực tế của hệ thống. Em xin hoàn toàn chịu trách nhiệm trước Hội đồng bộ môn và Nhà trường về tính trung thực của lời cam đoan này."
    )
    
    p_sign = doc.add_paragraph()
    p_sign.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_sign.paragraph_format.space_before = Pt(20)
    r = p_sign.add_run("Hà Nội, ngày 09 tháng 11 năm 2026\nSinh viên thực hiện\n\n\n\nNguyễn Thành Đông")
    r.font.bold = True

    doc.add_page_break()

    # ==========================================
    # MỤC LỤC (TABLE OF CONTENTS)
    # ==========================================
    p_toc_h = doc.add_heading("MỤC LỤC", level=1)
    p_toc_h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_toc_h.runs[0].font.color.rgb = RGBColor(15, 23, 42)
    p_toc_h.paragraph_format.space_after = Pt(14)

    toc_entries = [
        ("LỜI CẢM ƠN", "i", 1),
        ("LỜI CAM ĐOAN", "ii", 1),
        ("MỤC LỤC", "iii", 1),
        ("DANH MỤC HÌNH VẼ & SƠ ĐỒ THIẾT KẾ", "iv", 1),
        ("DANH MỤC BẢNG BIỂU & TỪ VIẾT TẮT", "v", 1),
        ("CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI", "1", 1),
        ("1.1. Giới thiệu bài toán thực tế", "1", 2),
        ("1.2. Mục đích xây dựng website", "1", 2),
        ("1.3. Đối tượng sử dụng hệ thống", "2", 2),
        ("1.4. Phạm vi đề tài (In-Scope & Out-of-Scope)", "2", 2),
        ("1.5. Tổng hợp các chức năng chính", "3", 2),
        ("1.6. Khảo sát và đối sánh các hệ thống tương tự", "3", 2),
        ("CHƯƠNG 2: PHÂN TÍCH VÀ ĐẶC TẢ YÊU CẦU", "5", 1),
        ("2.1. Yêu cầu chức năng (Functional Requirements)", "5", 2),
        ("2.2. Yêu cầu phi chức năng (Non-Functional Requirements)", "5", 2),
        ("2.3. Các tác nhân hệ thống (Actors)", "6", 2),
        ("2.4. Sơ đồ Use Case tổng thể hệ thống", "7", 2),
        ("2.5. Đặc tả chi tiết các Use Case tiêu biểu (UC01 – UC06)", "8", 2),
        ("CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG", "11", 1),
        ("3.1. Kiến trúc tổng thể hệ thống (Decoupled 3-Tier)", "11", 2),
        ("3.2. Thiết kế cơ sở dữ liệu quan hệ (ERD & Danh mục 14 bảng)", "11", 2),
        ("3.3. Thiết kế luồng nghiệp vụ (Sequence & Activity Diagrams)", "13", 2),
        ("3.4. Thiết kế giao diện (Cinema Noir Luxury Design System)", "15", 2),
        ("CHƯƠNG 4: CÔNG NGHỆ VÀ QUÁ TRÌNH XÂY DỰNG", "17", 1),
        ("4.1. Công nghệ sử dụng", "17", 2),
        ("4.2. Môi trường phát triển", "17", 2),
        ("4.3. Cấu trúc tổ chức mã nguồn", "18", 2),
        ("4.4. Quá trình xây dựng", "18", 2),
        ("4.5. Phân tích các chức năng kỹ thuật tiêu biểu", "19", 2),
        ("CHƯƠNG 5: KẾT QUẢ THỰC HIỆN VÀ KIỂM THỬ", "20", 1),
        ("5.1. Kết quả sản phẩm đạt được", "20", 2),
        ("5.2. Minh họa giao diện các màn hình chức năng", "20", 2),
        ("5.3. Bảng kịch bản kiểm thử chức năng (18 Test Cases)", "23", 2),
        ("5.4. Đánh giá kết quả và các cải tiến kỹ thuật", "25", 2),
        ("KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN", "26", 1),
        ("6.1. Kết luận chung", "26", 2),
        ("6.2. Kiến thức và kỹ năng đạt được", "26", 2),
        ("6.3. Hạn chế", "27", 2),
        ("6.4. Hướng phát triển trong tương lai (Roadmap v3.0)", "27", 2),
        ("TÀI LIỆU THAM KHẢO", "28", 1),
        ("PHỤ LỤC KỸ THUẬT", "29", 1),
        ("Phụ lục 1: Hướng dẫn cài đặt và chạy dự án tại môi trường cục bộ", "29", 2),
        ("Phụ lục 2: Danh sách tài khoản demo chấm đồ án", "30", 2),
        ("Phụ lục 3: Bảng mã lỗi API chuẩn hóa (ProblemDetails RFC 9110)", "31", 2)
    ]

    for title, page_str, level in toc_entries:
        add_toc_item(doc, title, page_str, level=level)

    doc.add_page_break()

    # ==========================================
    # DANH MỤC HÌNH VẼ & BẢNG BIỂU
    # ==========================================
    p_list_h = doc.add_heading("DANH MỤC HÌNH VẼ & SƠ ĐỒ THIẾT KẾ", level=1)
    p_list_h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_list_h.runs[0].font.color.rgb = RGBColor(15, 23, 42)

    figures_list = [
        "Hình 2.1: Sơ đồ Use Case tổng thể hệ thống PHIMBOOK",
        "Hình 2.2: Sơ đồ Thực thể Liên kết Cơ sở Dữ liệu (ERD PostgreSQL 16)",
        "Hình 2.3: Sơ đồ Tuần tự (Sequence Diagram) Luồng Đặt vé & Khóa giữ ghế 10 phút",
        "Hình 2.4: Sơ đồ Luồng Hoạt động Ghép đôi gu phim (CineMate) & Đặt vé nhóm (CineParty)",
        "Hình 3.1: Giao diện Trang chủ & Hero Spotlight Carousel bom tấn",
        "Hình 3.2: Giao diện Khám phá & Bộ lọc phim đa chiều",
        "Hình 3.3: Giao diện Chi tiết phim & Suất chiếu bí ẩn (Mystery Night)",
        "Hình 3.4: Giao diện Sơ đồ chọn ghế cong, CineMate Matchmaker & CineParty",
        "Hình 3.5: Giao diện Chọn Combo bắp nước & Dịch vụ phòng chiếu",
        "Hình 3.6: Giao diện Thanh toán trực tuyến & Vé điện tử QR Code động",
        "Hình 3.7: Giao diện Hộ chiếu điện ảnh số hóa (Passport) & Bộ sưu tập Huy hiệu 3D",
        "Hình 3.8: Giao diện Khẩu vị điện ảnh cá nhân (Cinematic Taste) & CineMatch AI",
        "Hình 3.9: Giao diện Hồ sơ hội viên VIP Elite Lounge & Đặc quyền",
        "Hình 3.10: Giao diện Đăng nhập & Xác thực bảo mật tài khoản"
    ]
    for fig in figures_list:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(3)
        r = p.add_run(fig)
        r.font.size = Pt(11)

    doc.add_paragraph()
    p_list_t = doc.add_heading("DANH MỤC BẢNG BIỂU & TỪ VIẾT TẮT", level=1)
    p_list_t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_list_t.runs[0].font.color.rgb = RGBColor(15, 23, 42)

    tables_list = [
        "Bảng 1.1: Ma trận đối sánh tính năng giữa PHIMBOOK và các hệ thống rạp truyền thống",
        "Bảng 2.1: Danh sách và vai trò các Tác nhân trong hệ thống PHIMBOOK",
        "Bảng 2.2: Bảng đặc tả Use Case UC01: Khám phá phim và chọn Suất chiếu bí ẩn",
        "Bảng 2.3: Bảng đặc tả Use Case UC02: Chọn ghế và Khóa giữ chỗ thời gian thực",
        "Bảng 2.4: Bảng đặc tả Use Case UC03: Đặt vé nhóm và Chia tiền tự động (CineParty)",
        "Bảng 2.5: Bảng đặc tả Use Case UC04: Ghép đôi gu phim người xem solo (CineMate)",
        "Bảng 2.6: Bảng đặc tả Use Case UC05: Chat tư vấn điện ảnh với Trợ lý ảo AI Concierge",
        "Bảng 2.7: Bảng đặc tả Use Case UC06: Soát vé tự động tại cổng rạp (Turnstile Check-in)",
        "Bảng 3.1: Bảng đặc tả chi tiết cấu trúc 14 thực thể cơ sở dữ liệu PostgreSQL",
        "Bảng 3.2: Bảng mã màu nhận diện thương hiệu Cinema Noir",
        "Bảng 5.1: Bảng kịch bản và kết quả kiểm thử chức năng (18 Test Cases)"
    ]
    for tbl in tables_list:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(3)
        r = p.add_run(tbl)
        r.font.size = Pt(11)

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI
    # ==========================================
    h1 = doc.add_heading("CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI", level=1)
    h1.runs[0].font.color.rgb = RGBColor(15, 23, 42)

    doc.add_heading("1.1. Giới thiệu bài toán thực tế", level=2)
    doc.add_paragraph(
        "Thị trường rạp chiếu phim hiện đại đang chứng kiến sự chuyển dịch rõ nét từ nhu cầu xem phim đại trà sang phân khúc "
        "trải nghiệm điện ảnh cao cấp (IMAX with Laser, ScreenX 270°, Dolby Atmos 64 kênh, phòng chiếu VIP Giường nằm First Class). "
        "Khán giả hiện đại không chỉ đến rạp để xem một bộ phim, mà tìm kiếm toàn bộ chuỗi trải nghiệm thị giác ấn tượng, tiện nghi phòng chờ "
        "và sự gắn kết văn hóa điện ảnh."
    )
    doc.add_paragraph(
        "Tuy nhiên, hầu hết các hệ thống đặt vé rạp chiếu phim trực tuyến hiện nay tại Việt Nam vẫn tồn tại những hạn chế cố hữu: "
        "giao diện bán vé mang tính rập khuôn, nghẽn mạng nghiêm trọng khi mở bán bom tấn, không có cơ chế giữ ghế thời gian thực minh bạch, "
        "hoàn toàn bỏ quên đối tượng khán giả đi xem phim một mình (solo moviegoers) và thiếu các công cụ tiện lợi cho nhóm bạn cùng chia sẻ hóa đơn."
    )

    doc.add_heading("1.2. Mục đích xây dựng website", level=2)
    doc.add_paragraph(
        "Hệ thống PHIMBOOK ra đời nhằm tái định nghĩa toàn bộ hành trình trải nghiệm của khách hàng thông qua 3 trụ cột giá trị cốt lõi:"
    )
    p = doc.add_paragraph()
    p.add_run("1. Trước khi xem (Pre-Show): ").bold = True
    p.add_run("Duyệt các tác phẩm bom tấn qua banner video 4K sắc nét, nhận tư vấn phim tức thì từ Trợ lý ảo AI Concierge và thuật toán ghép đôi khán giả solo có cùng gu điện ảnh (CineMate).\n")
    p.add_run("2. Trong quá trình đặt vé (Booking Journey): ").bold = True
    p.add_run("Trực quan hóa sơ đồ phòng chiếu uốn cong, áp dụng kỹ thuật khóa giữ ghế 10 phút (Redis Distributed Lock) chống trùng chỗ, cho phép đặt vé nhóm chia tiền tự động (CineParty) và đặt trước combo bắp nước cao cấp.\n")
    p.add_run("3. Sau khi xem (Post-Show & Gamification): ").bold = True
    p.add_run("Ghi nhận hành trình thưởng thức điện ảnh qua Hộ chiếu số hóa (CinePassport), sưu tầm các Huy hiệu 3D Hologram độc quyền và tích lũy quyền lợi thành viên thương gia VIP Elite Lounge.")

    doc.add_heading("1.3. Đối tượng sử dụng hệ thống", level=2)
    doc.add_paragraph(
        "Hệ thống được thiết kế hướng tới 5 nhóm đối tượng người dùng chính:\n"
        "• Khán giả yêu công nghệ điện ảnh (Tech Cinephiles): Đòi hỏi thông tin chuẩn xác về định dạng rạp (IMAX Laser, ScreenX, Dolby Cinema), tỷ lệ khung hình và âm thanh vòm.\n"
        "• Khán giả đi xem phim một mình (Solo Moviegoers): Thích thưởng thức điện ảnh độc lập nhưng muốn kết nối bạn bè cùng gu nghệ thuật.\n"
        "• Nhóm bạn bè & Gia đình (Social Bookers): Cần đặt liền kề nhiều vị trí ghế và chia tiền sòng phẳng không cần tính toán thủ công.\n"
        "• Khách hàng cao cấp (VIP Loungers): Quan tâm đến thẻ hội viên VIP Elite, phòng chờ thương gia và quyền lợi tích điểm đổi thưởng.\n"
        "• Nhân viên soát vé rạp (Turnstile Operator): Cần công cụ quét vé QR nhanh chóng, xác thực vé dưới 200ms tại cửa kiểm soát."
    )

    doc.add_heading("1.4. Phạm vi đề tài (Scope)", level=2)
    doc.add_paragraph(
        "• Nội dung trong phạm vi (In-Scope): Xây dựng hoàn chỉnh ứng dụng Web SPA đa nền tảng (Frontend React 19 + TypeScript + Vite) "
        "kết nối hệ thống Backend RESTful API (.NET 8 Web API Clean Architecture), quản lý cơ sở dữ liệu quan hệ PostgreSQL 16 trên Supabase Cloud, "
        "bộ đệm Redis giữ ghế, và mô hình Generative AI Google Gemini 2.0.\n"
        "• Nội dung ngoài phạm vi (Out-of-Scope): Đồ án không bao gồm phần điều khiển cơ khí máy chiếu rạp thực tế, máy in vé nhiệt tại quầy hoặc hệ thống cổng xoay cơ điện tử vật lý."
    )

    doc.add_heading("1.5. Tổng hợp các chức năng chính", level=2)
    doc.add_paragraph(
        "Hệ thống bao gồm 6 phân hệ nghiệp vụ chính:\n"
        "1. Khám phá & Trang chủ: Hero Spotlight bom tấn, Live Search Header, bộ lọc phim đa chiều, tra cứu lịch chiếu và cụm rạp 5 sao GPS.\n"
        "2. Chi tiết phim & Suất chiếu: Banner 4K, Modal trailer YouTube an toàn chống chặn, Suất chiếu bí ẩn (Mystery Night) giảm 40%.\n"
        "3. Luồng Đặt vé toàn diện: Sơ đồ ghế cong, bộ đếm giữ ghế 10 phút, CineMate kết nối gu solo, CineParty đặt vé nhóm, Combo bắp nước và Vé điện tử QR Code động.\n"
        "4. Trợ lý Trí tuệ Nhân tạo: CineBot AI Chatbot đa lượt 24/7, AiCineAdvisor và cơ chế tự động chuyển đổi dự phòng khi mạng chập chờn.\n"
        "5. Hồ sơ Thành viên & Gamification: Thẻ hội viên VIP Elite Lounge, Hộ chiếu điện ảnh CinePassport 3D Hologram, và Khẩu vị Cinematic Taste.\n"
        "6. Cổng Soát vé & Quản trị: Quét mã QR soát vé tự động (Turnstile Check-in) và quản lý danh mục suất chiếu."
    )

    doc.add_heading("1.6. Khảo sát và đối sánh các hệ thống tương tự", level=2)
    doc.add_paragraph("Ma trận đối sánh tính năng giữa PHIMBOOK và các ứng dụng rạp chiếu phổ biến hiện nay được tổng hợp trong Bảng 1.1:")

    # Bảng 1.1
    t1 = doc.add_table(rows=10, cols=5)
    t1_data = [
        ["Tiêu Chí Đánh Giá", "CGV Cinemas VN", "Galaxy Cinema", "Lotte Cinema", "PHIMBOOK (Đề tài)"],
        ["Phong cách thiết kế", "Đỏ truyền thống", "Cam / Trắng", "Đỏ / Xám", "Cinema Noir Luxury (Đen/Đỏ/Vàng)"],
        ["Chuẩn trợ năng", "Cơ bản", "Khá", "Cơ bản", "Đạt chuẩn WCAG AAA (>= 7:1)"],
        ["Khóa giữ chỗ realtime", "Không rõ ràng", "Có (5 phút)", "Không rõ ràng", "Có (10 phút Redis Lock)"],
        ["Suất chiếu bí ẩn (Mystery)", "Không có", "Không có", "Không có", "Có (Giảm 35-40%, phát sáng tím)"],
        ["Ghép đôi gu phim (CineMate)", "Không có", "Không có", "Không có", "Có (Tính % match gu điện ảnh)"],
        ["Đặt vé nhóm (CineParty)", "Không có", "Không có", "Không có", "Có (Tạo phòng, mời link, tách bill)"],
        ["Trợ lý ảo AI Concierge", "Bot kịch bản tĩnh", "Không có", "Không có", "Có (Google Gemini 2.0)"],
        ["Hộ chiếu điện ảnh 3D", "Không có", "Không có", "Không có", "Có (Passport số + Huy hiệu 3D)"],
        ["Trailer 4K chống chặn", "Iframe thường", "Iframe thường", "Iframe thường", "youtube-nocookie an toàn"]
    ]
    for r_idx, row in enumerate(t1_data):
        for c_idx, val in enumerate(row):
            t1.rows[r_idx].cells[c_idx].paragraphs[0].text = val
    style_table(t1, [Inches(1.8), Inches(1.0), Inches(1.0), Inches(1.0), Inches(1.8)])

    add_callout(doc, "Bảng đối sánh trên khẳng định PHIMBOOK không chỉ giải quyết trọn vẹn nghiệp vụ mua vé cơ bản mà còn tiên phong tích hợp các tính năng công nghệ sáng tạo, mang lại giá trị độc nhất trên thị trường.", "KẾT LUẬN KHẢO SÁT")

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 2: PHÂN TÍCH VÀ ĐẶC TẢ YÊU CẦU
    # ==========================================
    h2 = doc.add_heading("CHƯƠNG 2: PHÂN TÍCH VÀ ĐẶC TẢ YÊU CẦU", level=1)
    h2.runs[0].font.color.rgb = RGBColor(15, 23, 42)

    doc.add_heading("2.1. Yêu cầu chức năng (Functional Requirements)", level=2)
    doc.add_paragraph(
        "Hệ thống phân rã yêu cầu chức năng thành 3 nhóm quyền tác nhân chính:\n"
        "• Khách vãng lai (Guest): Duyệt trang chủ, tìm kiếm phim thời gian thực, lọc phim đa chiều, xem chi tiết phim và xem trailer 4K sắc nét.\n"
        "• Khách hàng thành viên (Member / VIP Elite): Đăng nhập an toàn, chọn ghế trên sơ đồ rạp cong, khóa giữ chỗ 10 phút, ghép đôi gu phim CineMate, đặt vé nhóm CineParty, đặt combo bắp nước, áp mã voucher, thanh toán trực tuyến, nhận vé QR Code động, tương tác với AI Concierge và quản lý hộ chiếu CinePassport.\n"
        "• Nhân viên soát vé & Quản trị viên (Staff / Admin): Quét mã QR vé tại cổng rạp Turnstile, tự động kiểm tra tính hợp lệ và thời gian check-in, quản lý danh mục suất chiếu và xem báo cáo tài chính."
    )

    doc.add_heading("2.2. Yêu cầu phi chức năng (Non-Functional Requirements)", level=2)
    doc.add_paragraph(
        "• Hiệu năng (Performance): Thời gian phản hồi API giữ ghế dưới 150ms. Gói bundle JavaScript nén Gzip ban đầu dưới 300 kB, tải trang lần đầu < 1.2s.\n"
        "• Bảo mật (Security): Mật khẩu băm an toàn bằng BCrypt. Xác thực JWT kép kết hợp Refresh Token xoay vòng. Mã vé QR Code được ký số HMAC-SHA256 chống làm giả. Chống trùng đơn bằng Idempotency-Key.\n"
        "• Trợ năng (Accessibility): Tuân thủ nghiêm ngặt chuẩn WCAG AAA với tỷ lệ tương phản chữ trên nền tối đạt từ 7.0:1 đến 18.5:1.\n"
        "• Tương thích trình duyệt: Chuẩn hóa nhúng YouTube Embed qua youtube-nocookie.com, vượt qua hoàn hảo các bộ lọc bảo vệ quyền riêng tư (Brave Shields, uBlock Origin)."
    )

    doc.add_heading("2.3. Các tác nhân hệ thống (Actors)", level=2)
    doc.add_paragraph("Danh sách và vai trò của các tác nhân tương tác với hệ thống PHIMBOOK được liệt kê tại Bảng 2.1:")

    # Bảng 2.1
    t2 = doc.add_table(rows=7, cols=3)
    t2_data = [
        ["Tác Nhân (Actor)", "Phân Loại", "Vai Trò & Quyền Hạn Trong Hệ Thống"],
        ["Khách vãng lai (Guest)", "Người dùng ngoài", "Xem danh sách phim, tìm kiếm, xem trailer và lịch chiếu rạp."],
        ["Khách hội viên (Member)", "Người dùng xác thực", "Chọn ghế, giữ chỗ 10p, đặt vé nhóm, thanh toán, nhận vé QR, tích điểm."],
        ["Hội viên VIP Elite", "Khách hàng thân thiết", "Hưởng đặc quyền phòng chờ thương gia, giảm giá vé và ưu đãi bắp nước."],
        ["Nhân viên soát vé (Staff)", "Người dùng nội bộ", "Quét mã QR soát vé tự động tại cổng kiểm soát phòng chiếu Turnstile."],
        ["Quản trị viên (Admin)", "Người dùng nội bộ", "Quản lý phim, rạp, cấu hình suất chiếu bí ẩn và theo dõi doanh thu."],
        ["Google Gemini AI", "Hệ thống bên ngoài", "Cung cấp động cơ xử lý ngôn ngữ tự nhiên và gợi ý phim thông minh."]
    ]
    for r_idx, row in enumerate(t2_data):
        for c_idx, val in enumerate(row):
            t2.rows[r_idx].cells[c_idx].paragraphs[0].text = val
    style_table(t2, [Inches(2.0), Inches(1.5), Inches(3.0)])

    doc.add_heading("2.4. Sơ đồ Use Case tổng thể hệ thống", level=2)
    doc.add_paragraph("Sơ đồ Use Case tổng thể biểu diễn mối quan hệ giữa các tác nhân và các ca sử dụng chính:")
    add_figure(doc, "docs/images/diagram_usecase.png", "Hình 2.1: Sơ đồ Use Case tổng thể hệ thống PHIMBOOK", width=Inches(6.2))

    doc.add_heading("2.5. Đặc tả chi tiết các Use Case tiêu biểu", level=2)
    doc.add_paragraph("Dưới đây là bảng đặc tả chi tiết 6 ca sử dụng tiêu biểu của hệ thống:")

    # Bảng 2.2: UC01
    doc.add_paragraph().add_run("A. Đặc tả Use Case UC01: Khám phá phim và chọn Suất chiếu bí ẩn (Mystery Night)").bold = True
    t_uc1 = doc.add_table(rows=6, cols=2)
    t_uc1_data = [
        ["Mục Đặc Tả", "Nội Dung Chi Tiết"],
        ["Tên Use Case / Mã", "Khám phá phim và chọn Suất chiếu bí ẩn (UC01)"],
        ["Tác nhân chính", "Khách vãng lai, Khách hàng hội viên"],
        ["Tiền điều kiện", "Khách hàng truy cập vào trang chủ hoặc trang Khám phá (/kham-pha)."],
        ["Luồng sự kiện chính", "1. Người dùng chọn ngày xem trong tuần (7 ngày kế tiếp).\n2. Chọn cụm rạp đối tác gần nhất.\n3. Hệ thống hiển thị các khung giờ chiếu. Suất chiếu đêm (>22:00) có nhãn phát sáng tím hologram '🔮 Bí ẩn' kèm mức giảm giá 40%.\n4. Người dùng bấm chọn suất chiếu bí ẩn.\n5. Thanh Sticky Booking Bar xuất hiện ở đáy màn hình hiển thị rạp, giờ chiếu và nút 'Tiếp tục chọn ghế'."],
        ["Hậu điều kiện", "Hệ thống lưu thông tin suất chiếu đã chọn và chuyển tiếp sang màn hình sơ đồ chọn ghế."]
    ]
    for r_idx, row in enumerate(t_uc1_data):
        for c_idx, val in enumerate(row):
            t_uc1.rows[r_idx].cells[c_idx].paragraphs[0].text = val
    style_table(t_uc1, [Inches(2.0), Inches(4.5)])

    # Bảng 2.3: UC02
    doc.add_paragraph().add_run("B. Đặc tả Use Case UC02: Chọn ghế và Khóa giữ chỗ thời gian thực (Redis Seat Locking)").bold = True
    t_uc2 = doc.add_table(rows=6, cols=2)
    t_uc2_data = [
        ["Mục Đặc Tả", "Nội Dung Chi Tiết"],
        ["Tên Use Case / Mã", "Chọn ghế và Khóa giữ chỗ thời gian thực (UC02)"],
        ["Tác nhân chính", "Khách hàng hội viên"],
        ["Tiền điều kiện", "Khách hàng đã đăng nhập và chọn suất chiếu hợp lệ."],
        ["Luồng sự kiện chính", "1. Khách hàng click vào các ghế còn trống trên sơ đồ rạp cong.\n2. Frontend gọi POST /api/v1/showtimes/{id}/seats/lock kèm danh sách seatIds.\n3. Backend sử dụng Redis Distributed Lock khóa ghế với thời gian sống TTL = 600 giây (10 phút).\n4. Backend trả về lockToken và thời gian hết hạn.\n5. Giao diện đổi màu ghế sang trạng thái 'Đang chọn' và kích hoạt Booking Timer đếm ngược 10:00."],
        ["Luồng ngoại lệ", "3a. Ghế vừa bị người khác giữ trước: Backend trả về HTTP 400 'Ghế đã được người khác giữ'. Frontend thông báo lỗi và tự động làm mới sơ đồ ghế."]
    ]
    for r_idx, row in enumerate(t_uc2_data):
        for c_idx, val in enumerate(row):
            t_uc2.rows[r_idx].cells[c_idx].paragraphs[0].text = val
    style_table(t_uc2, [Inches(2.0), Inches(4.5)])

    # Bảng 2.4: UC03
    doc.add_paragraph().add_run("C. Đặc tả Use Case UC03: Đặt vé nhóm và Chia tiền tự động (CineParty)").bold = True
    t_uc3 = doc.add_table(rows=5, cols=2)
    t_uc3_data = [
        ["Mục Đặc Tả", "Nội Dung Chi Tiết"],
        ["Tên Use Case / Mã", "Đặt vé nhóm và Chia tiền tự động (CineParty - UC03)"],
        ["Tác nhân chính", "Khách hàng hội viên (Trưởng nhóm Host & Thành viên Member)"],
        ["Luồng sự kiện chính", "1. Trưởng nhóm bấm 'Bật CineParty Đặt vé nhóm' tại màn hình chọn ghế.\n2. Hệ thống tạo phòng ảo, sinh mã PIN 6 số và URL chia sẻ riêng.\n3. Trưởng nhóm gửi liên kết cho bạn bè.\n4. Các thành viên vào link và tự click chọn vị trí ghế của mình trên sơ đồ realtime.\n5. Trưởng nhóm bấm 'Chốt danh sách đặt vé'. Hệ thống tự động chia đều tiền vé cho từng thành viên.\n6. Từng thành viên thanh toán phần của mình qua Quick-Pay/MoMo.\n7. Khi 100% thành viên trả xong, hệ thống tự động xuất vé riêng về tài khoản từng người."],
        ["Hậu điều kiện", "Đơn hàng hoàn tất, mỗi thành viên sở hữu mã vé QR độc lập mang tên mình."]
    ]
    for r_idx, row in enumerate(t_uc3_data):
        for c_idx, val in enumerate(row):
            t_uc3.rows[r_idx].cells[c_idx].paragraphs[0].text = val
    style_table(t_uc3, [Inches(2.0), Inches(4.5)])

    # Bảng 2.5: UC04
    doc.add_paragraph().add_run("D. Đặc tả Use Case UC04: Ghép đôi gu phim người xem solo (CineMate)").bold = True
    t_uc4 = doc.add_table(rows=5, cols=2)
    t_uc4_data = [
        ["Mục Đặc Tả", "Nội Dung Chi Tiết"],
        ["Tên Use Case / Mã", "Ghép đôi gu phim người xem solo (CineMate - UC04)"],
        ["Tác nhân chính", "Khách hàng hội viên đi xem một mình"],
        ["Luồng sự kiện chính", "1. Khách hàng chọn 1 ghế duy nhất, widget CineMate hiển thị nổi bật dưới sơ đồ ghế.\n2. Khách hàng bật tùy chọn 'Tìm bạn xem cùng gu trong phòng chiếu'.\n3. Thuật toán so khớp vector thể loại, đạo diễn yêu thích với các khán giả solo khác trong cùng phòng chiếu.\n4. Hiển thị danh sách bạn có độ trùng khớp cao (ví dụ: Match Rate 92%).\n5. Khách hàng có thể nhấn 'Gửi lời chào 👋' để làm quen văn minh trước giờ chiếu."],
        ["Hậu điều kiện", "Lời chào kết nối được gửi thành công đến tài khoản người xem cùng gu."]
    ]
    for r_idx, row in enumerate(t_uc4_data):
        for c_idx, val in enumerate(row):
            t_uc4.rows[r_idx].cells[c_idx].paragraphs[0].text = val
    style_table(t_uc4, [Inches(2.0), Inches(4.5)])

    # Bảng 2.6: UC05
    doc.add_paragraph().add_run("E. Đặc tả Use Case UC05: Chat tư vấn điện ảnh với Trợ lý ảo AI Concierge").bold = True
    t_uc5 = doc.add_table(rows=5, cols=2)
    t_uc5_data = [
        ["Mục Đặc Tả", "Nội Dung Chi Tiết"],
        ["Tên Use Case / Mã", "Chat tư vấn điện ảnh với Trợ lý ảo AI Concierge (UC05)"],
        ["Tác nhân chính", "Khách hàng hội viên, Khách vãng lai, Google Gemini AI"],
        ["Luồng sự kiện chính", "1. Người dùng click vào biểu tượng CineBot tròn phát sáng ở góc màn hình.\n2. Cửa sổ chat Cinema Noir mở ra.\n3. Người dùng nhập câu hỏi bằng tiếng Việt tự nhiên (VD: 'Gợi ý phim trinh thám gay cấn cuối tuần').\n4. Yêu cầu chuyển đến API trung gian kết nối mô hình Google Gemini 2.0.\n5. AI phân tích cảm xúc và phản hồi câu trả lời tự nhiên, kèm thẻ phim gợi ý và nút 'Đặt vé ngay'.\n6. Người dùng click vào thẻ phim để chuyển tiếp đến lịch chiếu tương ứng."],
        ["Luồng ngoại lệ", "4a. Mất kết nối API AI: Widget tự động kích hoạt chế độ Fallback, hiển thị danh mục phim bom tấn thịnh hành thay vì báo lỗi gián đoạn."]
    ]
    for r_idx, row in enumerate(t_uc5_data):
        for c_idx, val in enumerate(row):
            t_uc5.rows[r_idx].cells[c_idx].paragraphs[0].text = val
    style_table(t_uc5, [Inches(2.0), Inches(4.5)])

    # Bảng 2.7: UC06
    doc.add_paragraph().add_run("F. Đặc tả Use Case UC06: Soát vé tự động tại cổng rạp (Turnstile Check-in)").bold = True
    t_uc6 = doc.add_table(rows=6, cols=2)
    t_uc6_data = [
        ["Mục Đặc Tả", "Nội Dung Chi Tiết"],
        ["Tên Use Case / Mã", "Soát vé tự động tại cổng rạp Turnstile (UC06)"],
        ["Tác nhân chính", "Khách hàng, Nhân viên soát vé / Cổng tự động Turnstile"],
        ["Tiền điều kiện", "Khách hàng có vé điện tử hợp lệ với mã QR chữ ký HMAC."],
        ["Luồng sự kiện chính", "1. Khách hàng đưa mã QR vé điện tử trước máy quét laser tại cổng soát vé.\n2. Thiết bị gửi passCode về API POST /api/v1/tickets/turnstile-checkin.\n3. Hệ thống kiểm tra: tính toàn vẹn chữ ký HMAC, thời gian suất chiếu và trạng thái vé chưa sử dụng.\n4. Backend ghi nhận thời gian checkedInAt và gửi tín hiệu mở cổng.\n5. Đèn xanh bật sáng và màn hình hiển thị lời chào mừng vào phòng chiếu."],
        ["Luồng ngoại lệ", "3a. Vé đã quét trước đó: Hệ thống phát tín hiệu cảnh báo đỏ 'Vé đã sử dụng lúc hh:mm', cổng khóa chặt để nhân viên kiểm tra."]
    ]
    for r_idx, row in enumerate(t_uc6_data):
        for c_idx, val in enumerate(row):
            t_uc6.rows[r_idx].cells[c_idx].paragraphs[0].text = val
    style_table(t_uc6, [Inches(2.0), Inches(4.5)])

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG
    # ==========================================
    h3 = doc.add_heading("CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG", level=1)
    h3.runs[0].font.color.rgb = RGBColor(15, 23, 42)

    doc.add_heading("3.1. Kiến trúc tổng thể hệ thống (Decoupled 3-Tier)", level=2)
    doc.add_paragraph(
        "Hệ thống PHIMBOOK được kiến trúc theo mô hình phân tách độc lập 3 tầng (Decoupled 3-Tier Architecture), "
        "đảm bảo khả năng bảo trì cao, tối ưu hóa bộ nhớ đệm và mở rộng độc lập giữa tầng giao diện và dịch vụ lõi:\n"
        "• Tầng Trình diễn (Frontend Presentation Tier): Ứng dụng Single Page Application (SPA) phát triển bằng React 19, TypeScript và Vite, "
        "triển khai trên mạng lưới phân phối nội dung toàn cầu Vercel Edge CDN.\n"
        "• Tầng Dịch vụ Nghiệp vụ (Backend API Tier): Xây dựng trên nền tảng .NET 8 Web API theo chuẩn Clean Architecture (API, Application, Domain, Infrastructure), "
        "đóng gói Docker container chạy trên nền tảng đám mây Railway.\n"
        "• Tầng Dữ liệu & Caching (Persistence Tier): Cơ sở dữ liệu quan hệ PostgreSQL 16 trên nền tảng Supabase Cloud kết hợp bộ đệm phân tán Redis "
        "đảm nhiệm xử lý khóa ghế thời gian thực."
    )

    doc.add_heading("3.2. Thiết kế cơ sở dữ liệu quan hệ (ERD)", level=2)
    doc.add_paragraph(
        "Cơ sở dữ liệu của PHIMBOOK được chuẩn hóa ở dạng chuẩn 3 (3NF), bao gồm 14 thực thể quan hệ chặt chẽ. "
        "Sơ đồ thực thể liên kết ERD được biểu diễn chi tiết tại Hình 2.2:"
    )
    add_figure(doc, "docs/images/diagram_erd.png", "Hình 2.2: Sơ đồ Thực thể Liên kết Cơ sở Dữ liệu (ERD PostgreSQL 16)", width=Inches(6.2))

    doc.add_paragraph("Mô tả chi tiết 14 bảng dữ liệu và ý nghĩa nghiệp vụ được trình bày trong Bảng 3.1:")

    # Bảng 3.1
    t_db = doc.add_table(rows=15, cols=4)
    t_db_data = [
        ["Tên Bảng", "Khóa Chính (PK)", "Khóa Ngoại (FK)", "Ý Nghĩa Nghiệp Vụ"],
        ["users", "id (UUID)", "-", "Tài khoản người dùng, email, mật khẩu băm BCrypt, vai trò."],
        ["user_profiles", "id (UUID)", "user_id", "Hồ sơ cá nhân, hạng hội viên VIP Elite, điểm thưởng tích lũy."],
        ["movies", "id (UUID)", "-", "Danh mục phim, tiêu đề, đạo diễn, tóm tắt, banner 4K, điểm IMDb."],
        ["genres", "id (UUID)", "-", "Danh mục thể loại phim (Hành động, Tâm lý, Hoạt hình...)."],
        ["movie_genres", "id (UUID)", "movie_id, genre_id", "Bảng trung gian liên kết đa - đa giữa phim và thể loại."],
        ["theaters", "id (UUID)", "-", "Cụm rạp 5 sao, địa chỉ, logo chuỗi rạp, tọa độ GPS."],
        ["auditoriums", "id (UUID)", "theater_id", "Phòng chiếu (IMAX Laser, ScreenX, Standard 2D, Gold Class)."],
        ["seats", "id (UUID)", "auditorium_id", "Danh sách từng ghế vật lý (STANDARD, VIP, SWEETBOX đôi)."],
        ["showtimes", "id (UUID)", "movie_id, auditorium_id", "Lịch chiếu, giờ bắt đầu, giá vé, cờ Suất chiếu bí ẩn."],
        ["bookings", "id (UUID)", "user_id, showtime_id", "Đơn hàng đặt vé, mã orderCode, tổng tiền, trạng thái đơn."],
        ["tickets", "id (UUID)", "booking_id, seat_id", "Vé điện tử độc lập cho từng vị trí ghế kèm mã QR check-in."],
        ["concessions", "id (UUID)", "-", "Danh mục bắp rang bơ, nước giải khát và quà lưu niệm."],
        ["order_concessions", "id (UUID)", "booking_id, concession_id", "Chi tiết số lượng bắp nước đi kèm trong từng đơn hàng."],
        ["passport_badges", "id (UUID)", "user_id", "Huy hiệu 3D thành tích điện ảnh đã mở khóa của khách hàng."]
    ]
    for r_idx, row in enumerate(t_db_data):
        for c_idx, val in enumerate(row):
            t_db.rows[r_idx].cells[c_idx].paragraphs[0].text = val
    style_table(t_db, [Inches(1.8), Inches(1.3), Inches(1.8), Inches(2.3)])

    doc.add_heading("3.3. Thiết kế luồng nghiệp vụ (Sequence & Activity Diagrams)", level=2)
    doc.add_paragraph(
        "Luồng nghiệp vụ Đặt vé trực tuyến và Khóa giữ ghế 10 phút được biểu diễn chi tiết qua Sơ đồ Tuần tự (Sequence Diagram) tại Hình 2.3:"
    )
    add_figure(doc, "docs/images/diagram_sequence_booking.png", "Hình 2.3: Sơ đồ Tuần tự (Sequence Diagram) Luồng Đặt vé & Khóa giữ ghế 10 phút", width=Inches(6.2))

    doc.add_paragraph(
        "Luồng nghiệp vụ tương tác mạng xã hội CineMate (Ghép đôi gu phim solo) và CineParty (Đặt vé nhóm chia tiền tự động) "
        "được mô hình hóa qua Sơ đồ Hoạt động tại Hình 2.4:"
    )
    add_figure(doc, "docs/images/diagram_flow_cinemate_cineparty.png", "Hình 2.4: Sơ đồ Luồng Hoạt động Ghép đôi gu phim (CineMate) & Đặt vé nhóm (CineParty)", width=Inches(6.2))

    doc.add_heading("3.4. Thiết kế giao diện (Cinema Noir Luxury Design System)", level=2)
    doc.add_paragraph(
        "Giao diện PHIMBOOK được định hình theo phong cách **Cinema Noir Luxury**, sử dụng bảng mã màu sang trọng, "
        "tối ưu hóa độ tương phản trợ năng theo tiêu chuẩn quốc tế WCAG AAA:"
    )

    # Bảng 3.2
    t_col = doc.add_table(rows=8, cols=4)
    t_col_data = [
        ["Vai Trò Thiết Kế", "Tên Màu", "Mã HEX", "Ứng Dụng Trong Giao Diện"],
        ["Nền chính (Canvas)", "Obsidian Black", "#0B0B0C", "Nền tổng thể toàn bộ trang web."],
        ["Nền thẻ (Surface)", "Charcoal Noir", "#18181B / #1C1B1C", "Nền thẻ phim, thẻ rạp, card form modal."],
        ["Màu thương hiệu (Primary)", "Crimson Red", "#FF535A", "Nút bấm hành động chính (Đặt vé ngay, Xác nhận)."],
        ["Màu điểm nhấn (Accent)", "Champagne Gold", "#FFB955", "Điểm số IMDb, huy hiệu VIP Elite, viền ghế VIP."],
        ["Màu huyền bí (Mystery)", "Violet Hologram", "#A855F7", "Nhãn Suất chiếu bí ẩn, hiệu ứng phát sáng neon."],
        ["Màu tiêu đề (Heading)", "Pure White", "#FFFFFF", "Toàn bộ tiêu đề, nhãn thẻ, đạt tương phản 18.5:1."],
        ["Màu nội dung (Text)", "Slate Gray", "#F1F5F9 / #94A3B8", "Nội dung mô tả cốt truyện, đạt chuẩn WCAG AAA."]
    ]
    for r_idx, row in enumerate(t_col_data):
        for c_idx, val in enumerate(row):
            t_col.rows[r_idx].cells[c_idx].paragraphs[0].text = val
    style_table(t_col, [Inches(1.8), Inches(1.5), Inches(1.5), Inches(2.5)])

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 4: CÔNG NGHỆ VÀ QUÁ TRÌNH XÂY DỰNG
    # ==========================================
    h4 = doc.add_heading("CHƯƠNG 4: CÔNG NGHỆ VÀ QUÁ TRÌNH XÂY DỰNG", level=1)
    h4.runs[0].font.color.rgb = RGBColor(15, 23, 42)

    doc.add_heading("4.1. Công nghệ sử dụng", level=2)
    doc.add_paragraph(
        "Hệ thống tích hợp các công nghệ và thư viện kỹ thuật hiện đại nhất:\n"
        "• Frontend: React 19, TypeScript 5.8, Vite 7.2, Ant Design 6.1.0, Styled-Components, TanStack React Query v5, React Router DOM v6, GSAP Animation, react-i18next.\n"
        "• Backend: .NET 8 Web API, C# 12, Entity Framework Core 8, Npgsql Provider, AutoMapper, FluentValidation, BCrypt.Net, JWT Bearer Token.\n"
        "• Cơ sở dữ liệu: PostgreSQL 16 trên Supabase Cloud, Redis Distributed Caching.\n"
        "• Trí tuệ nhân tạo: Google Gemini 2.0 API.\n"
        "• DevOps & Hosting: Vercel Edge Global CDN, Railway Cloud, Git, GitLab, Postman."
    )

    doc.add_heading("4.2. Môi trường phát triển", level=2)
    doc.add_paragraph(
        "Hệ điều hành Windows 11 Pro 64-bit; Môi trường thực thi Node.js v20.18 LTS và .NET SDK 8.0.300; "
        "Môi trường phát triển tích hợp (IDE): Visual Studio Code và JetBrains Rider."
    )

    doc.add_heading("4.3. Cấu trúc tổ chức mã nguồn", level=2)
    doc.add_paragraph(
        "Dự án Frontend được tổ chức theo kiến trúc hướng chức năng (Feature-based Architecture):\n"
        "• src/config/: Cấu hình Axios instance, AppRoutes và Ant Design theme token.\n"
        "• src/features/: Chứa các phân hệ nghiệp vụ độc lập (home, movie-discovery, movie-details, booking, ai-concierge, passport, profile, auth).\n"
        "• src/guards/: Chứa AuthGuard và GuestGuard bảo vệ quyền truy cập định tuyến.\n"
        "• src/layouts/: Chứa BookingLayout, MainLayout, Header, Footer và Sidebar.\n"
        "• src/shared/: Chứa các dịch vụ dùng chung (services, animations, types, utils).\n"
        "• src/styles/: Chứa GlobalStyles.ts, AntdOverrides.ts và hệ thống Breakpoints."
    )

    doc.add_heading("4.4. Quá trình xây dựng", level=2)
    doc.add_paragraph(
        "Quy trình phát triển được thực hiện bài bản qua 5 giai đoạn: Đặc tả bài toán -> Thiết kế UI/UX & Tokens -> Xây dựng Backend API & Redis Lock -> "
        "Lập trình Frontend & Kết nối Gemini AI -> Kiểm thử toàn diện và đóng gói triển khai Cloud."
    )

    doc.add_heading("4.5. Phân tích các chức năng kỹ thuật tiêu biểu", level=2)
    doc.add_paragraph(
        "1. Cơ chế tự động Refresh Token và phục hồi phiên trong Axios Interceptor: Đảm bảo phiên người dùng không bao giờ bị gián đoạn khi đang chọn ghế.\n"
        "2. Thuật toán Redis Distributed Lock: Sử dụng cờ SETNX với thời gian sống 600 giây (10 phút) để khóa ghế nguyên tử (Atomic locking).\n"
        "3. Chuẩn hóa nhúng Trailer YouTube qua youtube-nocookie.com: Chống sập trang trên trình duyệt Brave và tiện ích chặn quảng cáo uBlock Origin."
    )

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 5: KẾT QUẢ THỰC HIỆN VÀ KIỂM THỬ
    # ==========================================
    h5 = doc.add_heading("CHƯƠNG 5: KẾT QUẢ THỰC HIỆN VÀ KIỂM THỬ", level=1)
    h5.runs[0].font.color.rgb = RGBColor(15, 23, 42)

    doc.add_heading("5.1. Kết quả sản phẩm đạt được", level=2)
    doc.add_paragraph(
        "Đồ án đã hoàn thiện 100% các mục tiêu đề ra và được phát hành chính thức trên Internet:\n"
        "• Địa chỉ Live Frontend: https://bookmovie-gray.vercel.app\n"
        "• Địa chỉ Live Backend API: https://be-bookphim-production.up.railway.app/swagger\n"
        "• Kết quả đo lường Google Lighthouse: Đạt 95/100 điểm Performance và 100/100 điểm Accessibility."
    )

    doc.add_heading("5.2. Minh họa giao diện các màn hình chức năng", level=2)
    doc.add_paragraph("Dưới đây là hình ảnh chụp thực tế từ hệ thống đang vận hành trên môi trường Live:")

    add_figure(doc, "docs/images/screen_home_wow_v3.png", "Hình 3.1: Giao diện Trang chủ & Hero Spotlight Carousel bom tấn", width=Inches(6.0))
    add_figure(doc, "docs/images/screen_discovery.png", "Hình 3.2: Giao diện Khám phá & Bộ lọc phim đa chiều", width=Inches(6.0))
    add_figure(doc, "docs/images/screen_movie_details.png", "Hình 3.3: Giao diện Chi tiết phim & Suất chiếu bí ẩn (Mystery Night)", width=Inches(6.0))
    add_figure(doc, "docs/images/screen_seat_selection.png", "Hình 3.4: Giao diện Sơ đồ chọn ghế cong, CineMate Matchmaker & CineParty", width=Inches(6.0))
    add_figure(doc, "docs/images/screen_snacks.png", "Hình 3.5: Giao diện Chọn Combo bắp nước & Dịch vụ phòng chiếu", width=Inches(6.0))
    add_figure(doc, "docs/images/screen_checkout.png", "Hình 3.6: Giao diện Thanh toán trực tuyến & Vé điện tử QR Code động", width=Inches(6.0))
    add_figure(doc, "docs/images/screen_passport.png", "Hình 3.7: Giao diện Hộ chiếu điện ảnh số hóa (Passport) & Bộ sưu tập Huy hiệu 3D", width=Inches(6.0))
    add_figure(doc, "docs/images/screen_cinematic_taste.png", "Hình 3.8: Giao diện Khẩu vị điện ảnh cá nhân (Cinematic Taste) & CineMatch AI", width=Inches(6.0))
    add_figure(doc, "docs/images/screen_vip_elite.png", "Hình 3.9: Giao diện Hồ sơ hội viên VIP Elite Lounge & Đặc quyền", width=Inches(6.0))
    add_figure(doc, "docs/images/screen_login.png", "Hình 3.10: Giao diện Đăng nhập & Xác thực bảo mật tài khoản", width=Inches(6.0))

    doc.add_heading("5.3. Bảng kịch bản kiểm thử chức năng (18 Test Cases)", level=2)
    doc.add_paragraph("Toàn bộ 18 kịch bản kiểm thử chức năng chi tiết được tổng hợp tại Bảng 5.1:")

    # Bảng 5.1: 18 Test Cases
    t_tc = doc.add_table(rows=19, cols=7)
    t_tc_data = [
        ["STT", "Mã TC", "Phân Hệ", "Điều Kiện / Dữ Liệu", "Kết Quả Mong Đợi", "Kết Quả Thực Tế", "Đánh Giá"],
        ["1", "TC01", "Xác thực", "Email & Mật khẩu đúng", "Đăng nhập thành công, lưu JWT", "Đăng nhập mượt mà, lưu token", "Đạt"],
        ["2", "TC02", "Xác thực", "Mật khẩu không đúng", "Báo lỗi tương phản chữ trắng", "Notification đỏ chữ trắng WCAG AAA", "Đạt"],
        ["3", "TC03", "Khám phá", "Live Search 'Mai'", "Gợi ý tức thì phim Mai trong 50ms", "Hiển thị đúng dropdown kết quả", "Đạt"],
        ["4", "TC04", "Khám phá", "Lọc định dạng IMAX", "Danh sách chỉ gồm phim IMAX", "Lọc chính xác các phim IMAX Laser", "Đạt"],
        ["5", "TC05", "Chi tiết", "Xem Trailer 4K trên Brave", "Video phát mượt, không sập trang", "Phát qua youtube-nocookie an toàn", "Đạt"],
        ["6", "TC06", "Lịch chiếu", "Suất đêm > 22:00", "Phát sáng tím, giảm giá 40%", "Ô giờ phát sáng tím, giảm đúng 40%", "Đạt"],
        ["7", "TC07", "Đặt vé", "Chọn ghế A1, D5", "Đổi màu ghế, bật timer 10:00", "Khóa ghế Redis, timer chạy chuẩn", "Đạt"],
        ["8", "TC08", "Đặt vé", "Tranh chấp chọn trùng ghế", "Client 2 nhận thông báo lỗi", "Client 2 báo lỗi ghế đã được giữ", "Đạt"],
        ["9", "TC09", "Đặt vé", "Hết hạn giữ chỗ 10:00", "Nhả ghế về trạng thái trống", "Ghế tự động giải phóng toàn hệ thống", "Đạt"],
        ["10", "TC10", "CineMate", "Đi xem solo 1 ghế", "Tính % match gu, gửi lời chào", "Hiển thị match 92%, gửi chào tốt", "Đạt"],
        ["11", "TC11", "CineParty", "Tạo phòng đặt vé nhóm", "Bạn bè vào link tự chọn ghế", "Đồng bộ realtime ghế của bạn bè", "Đạt"],
        ["12", "TC12", "CineParty", "Chốt đơn tách tiền", "Chia đều hóa đơn cho từng người", "Chia đúng từng đồng, xuất đủ vé", "Đạt"],
        ["13", "TC13", "Dịch vụ", "Thêm Combo bắp phô mai", "Cộng 85.000đ vào tổng tiền", "Tổng hóa đơn cập nhật tức thì", "Đạt"],
        ["14", "TC14", "Giảm giá", "Áp mã PHIMMOI20", "Giảm 20% trên tổng tiền vé", "Giảm đúng 20%, hiển thị chiết khấu", "Đạt"],
        ["15", "TC15", "Thanh toán", "Quick-Pay 1 chạm (<500k)", "Khớp lệnh PAID tức thì không redirect", "Xuất vé thành công dưới 200ms", "Đạt"],
        ["16", "TC16", "Vé điện tử", "Mở vé trong Vé Của Tôi", "Hiển thị QR Code và mã phòng", "Mã QR sắc nét kèm thông tin ghế", "Đạt"],
        ["17", "TC17", "Soát vé", "Quét QR tại Turnstile", "Mở cổng, ghi nhận check-in", "Check-in thành công, quét lần 2 báo lỗi", "Đạt"],
        ["18", "TC18", "AI Bot", "Hỏi CineBot bằng tiếng Việt", "Trả lời thông minh, kèm thẻ phim", "Bot tư vấn chuẩn, đính kèm thẻ phim", "Đạt"]
    ]
    for r_idx, row in enumerate(t_tc_data):
        for c_idx, val in enumerate(row):
            t_tc.rows[r_idx].cells[c_idx].paragraphs[0].text = val
    style_table(t_tc, [Inches(0.4), Inches(0.7), Inches(0.9), Inches(1.5), Inches(1.7), Inches(1.5), Inches(0.6)])

    doc.add_heading("5.4. Đánh giá kết quả và các cải tiến kỹ thuật", level=2)
    doc.add_paragraph(
        "Trong quá trình kiểm thử, nhóm tác giả đã phân tích nguyên nhân gốc rễ và xử lý dứt điểm các vấn đề kỹ thuật phát sinh:\n"
        "• Khắc phục triệt để lỗi màu chữ thông báo Ant Design 6 bị đen xì trên nền tối, nâng chuẩn trợ năng lên WCAG AAA.\n"
        "• Khắc phục hoàn toàn sự cố sập màn hình YouTube Trailer trên trình duyệt Brave Shields bằng tên miền youtube-nocookie.com.\n"
        "• Kích hoạt hiệu ứng phát sáng neon tím cho Suất chiếu bí ẩn đêm muộn kèm cơ chế chiết khấu tự động 40%."
    )

    doc.add_page_break()

    # ==========================================
    # KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN
    # ==========================================
    h6 = doc.add_heading("KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN", level=1)
    h6.runs[0].font.color.rgb = RGBColor(15, 23, 42)

    doc.add_heading("6.1. Kết luận chung", level=2)
    doc.add_paragraph(
        "Đồ án \"Xây dựng hệ thống đặt vé xem phim trực tuyến tiêu chuẩn quốc tế (PHIMBOOK - Cinematic Lounge)\" "
        "đã hoàn thành xuất sắc các mục tiêu nghiên cứu và ứng dụng thực tiễn. Hệ thống kết hợp hài hòa giữa kiến trúc phần mềm hiện đại "
        "(Clean Architecture trên .NET 8, React 19 SPA, Redis Distributed Lock) với trải nghiệm thẩm mỹ điện ảnh Cinema Noir độc bản, "
        "giải quyết thấu đáo các bài toán tranh chấp giữ ghế và kết nối cộng đồng người yêu điện ảnh."
    )

    doc.add_heading("6.2. Kiến thức và kỹ năng đạt được", level=2)
    doc.add_paragraph(
        "• Làm chủ kỹ thuật thiết kế kiến trúc phân tầng Clean Architecture và kiểm soát tranh chấp bằng Redis Lock.\n"
        "• Nâng cao tư duy xây dựng giao diện người dùng theo Design Tokens và chuẩn trợ năng quốc tế WCAG AAA.\n"
        "• Làm chủ công nghệ Frontend React 19, TypeScript nghiêm ngặt và quản lý cache bất đồng bộ với TanStack Query v5.\n"
        "• Tích hợp thành công mô hình ngôn ngữ lớn Google Gemini 2.0 vào ứng dụng thương mại điện tử thực tế."
    )

    doc.add_heading("6.3. Hạn chế", level=2)
    doc.add_paragraph(
        "• Cổng thanh toán MoMo và VNPAY hiện mới vận hành ở môi trường Sandbox mô phỏng, chưa kích hoạt webhook IPN trừ tiền thực tế do hạn chế về giấy phép thương mại.\n"
        "• Chưa phát hành phiên bản ứng dụng Native trên iOS App Store và Google Play Store."
    )

    doc.add_heading("6.4. Hướng phát triển trong tương lai (Roadmap v3.0)", level=2)
    doc.add_paragraph(
        "1. Đấu nối thanh toán thương mại điện tử thực tế với VNPAY Merchant và MoMo Business.\n"
        "2. Nâng cấp Trợ lý ảo CineBot thành Voice AI Concierge hai chiều sử dụng Gemini 2.0 Multimodal Live API.\n"
        "3. Đóng gói ứng dụng Progressive Web App (PWA) hỗ trợ cài đặt trên màn hình chính và thông báo đẩy (Push Notification) trước giờ chiếu."
    )

    doc.add_page_break()

    # ==========================================
    # TÀI LIỆU THAM KHẢO & PHỤ LỤC
    # ==========================================
    h7 = doc.add_heading("TÀI LIỆU THAM KHẢO", level=1)
    h7.runs[0].font.color.rgb = RGBColor(15, 23, 42)

    refs = [
        "1. Bộ Giáo dục và Đào tạo / Trường Đại học Công nghệ: Giáo trình Xây dựng Website và Phát triển Ứng dụng Web nâng cao, 2024.",
        "2. Microsoft Corporation: .NET 8 Web API Documentation & Clean Architecture Guidelines, https://learn.microsoft.com/aspnet/core.",
        "3. React Team: React 19 Documentation & Server Components, https://react.dev.",
        "4. Vite Core Team: Vite Next Generation Frontend Tooling Guide, https://vitejs.dev.",
        "5. Ant Design Group: Ant Design 6 Enterprise UI Design Language & Dark Theme Tokens, https://ant.design.",
        "6. Supabase Cloud: PostgreSQL 16 High Availability & Row Level Security (RLS) Manual, https://supabase.com/docs.",
        "7. Redis Ltd.: Distributed Locks with Redis (The Redlock Algorithm), https://redis.io/topics/distlock.",
        "8. World Wide Web Consortium (W3C): Web Content Accessibility Guidelines (WCAG) 2.2 Standard, https://www.w3.org/TR/WCAG22.",
        "9. Google AI for Developers: Gemini API Quickstart & Prompt Engineering for Chatbots, https://ai.google.dev."
    ]
    for ref in refs:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(3)
        r = p.add_run(ref)
        r.font.size = Pt(11)

    doc.add_page_break()

    h8 = doc.add_heading("PHỤ LỤC KỸ THUẬT", level=1)
    h8.runs[0].font.color.rgb = RGBColor(15, 23, 42)

    doc.add_heading("Phụ lục 1: Hướng dẫn cài đặt và chạy dự án tại môi trường cục bộ", level=2)
    doc.add_paragraph(
        "1. Yêu cầu tiên quyết: Node.js >= 20.0 LTS, .NET SDK >= 8.0, Git Client.\n"
        "2. Khởi chạy Frontend:\n"
        "   cd base-react-vite-main\n"
        "   npm install\n"
        "   npm run dev  (Truy cập tại http://localhost:5173/)\n"
        "   npm run build && npm run preview (Kiểm tra bản build tại http://localhost:4173/)\n"
        "3. Biến môi trường (.env):\n"
        "   VITE_API_BASE_URL=https://be-bookphim-production.up.railway.app\n"
        "   VITE_APP_NAME=\"PHIMBOOK - Cinematic Lounge\""
    )

    doc.add_heading("Phụ lục 2: Danh sách tài khoản demo chấm đồ án", level=2)
    t_acc = doc.add_table(rows=5, cols=4)
    t_acc_data = [
        ["Loại Tài Khoản", "Email Đăng Nhập", "Mật Khẩu", "Quyền Hạn / Hạng Thẻ"],
        ["Quản trị viên (Admin)", "admin@phimbook.vn", "Password123@", "Toàn quyền quản trị, VIP Elite"],
        ["Khách hàng VIP Elite", "vip@phimbook.vn", "Password123@", "Hạng VIP Elite, 500 điểm thưởng"],
        ["Khách hàng thân thiết", "dongbuster@gmail.com", "Password123@", "Hạng Gold, Hộ chiếu có 4 huy hiệu"],
        ["Nhân viên soát vé rạp", "staff@phimbook.vn", "Password123@", "Quyền quét vé cổng Turnstile Check-in"]
    ]
    for r_idx, row in enumerate(t_acc_data):
        for c_idx, val in enumerate(row):
            t_acc.rows[r_idx].cells[c_idx].paragraphs[0].text = val
    style_table(t_acc, [Inches(1.8), Inches(1.8), Inches(1.3), Inches(2.3)])

    doc.add_heading("Phụ lục 3: Bảng mã lỗi API chuẩn hóa (ProblemDetails RFC 9110)", level=2)
    t_err = doc.add_table(rows=7, cols=3)
    t_err_data = [
        ["HTTP Code", "Mã Lỗi Nghiệp Vụ", "Thông Báo Phản Hồi / Xử Lý Phía FE"],
        ["400", "SEAT_ALREADY_LOCKED", "Ghế đã được người khác giữ chỗ. Vui lòng chọn ghế khác!"],
        ["400", "LOCK_TOKEN_EXPIRED", "Phiên giữ chỗ 10 phút của bạn đã hết hạn! Vui lòng chọn lại."],
        ["400", "VOUCHER_INVALID", "Mã giảm giá không tồn tại hoặc đã hết lượt áp dụng!"],
        ["401", "TOKEN_EXPIRED", "Phiên đăng nhập hết hạn! Tự động refresh token."],
        ["409", "IDEMPOTENCY_CONFLICT", "Giao dịch đang được xử lý, vui lòng không click liên tục!"],
        ["500", "INTERNAL_SERVER_ERROR", "Đã xảy ra lỗi hệ thống! Kích hoạt chế độ fallback ngoại tuyến."]
    ]
    for r_idx, row in enumerate(t_err_data):
        for c_idx, val in enumerate(row):
            t_err.rows[r_idx].cells[c_idx].paragraphs[0].text = val
    style_table(t_err, [Inches(1.0), Inches(2.3), Inches(3.7)])

    # Lưu tài liệu hoàn chỉnh (xử lý khi file đang mở trong Word)
    out_path = os.path.join(os.getcwd(), "docs", "Bao_Cao_Mon_Hoc_PHIMBOOK_Final.docx")
    try:
        doc.save(out_path)
        print(f"Đã tạo thành công tài liệu: {out_path}")
    except PermissionError:
        alt_path = os.path.join(os.getcwd(), "docs", "Bao_Cao_Mon_Hoc_PHIMBOOK_Final_CoMucLuc.docx")
        doc.save(alt_path)
        print(f"File chính đang mở trong Word, đã lưu sang: {alt_path}")

if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    build_docx_report()
