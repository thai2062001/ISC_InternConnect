import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./termofservice.module.scss";
import jwt_decode from "jwt-decode";
import { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';

const cx = classNames.bind(styles);
function TermOfServices() {

  return (
    <div className={cx("wrapper")}>
      <Helmet>
        <title>Điều khoản</title>
      </Helmet>
      <h1 className={cx('title')}>ĐIỀU KHOẢN SỬ DỤNG DỊCH VỤ VỚI ỨNG VIÊN</h1>
      <div className={cx("form-detail")}>
        <div className={cx("paragraph")}>
          <h2 className={cx("text")}>I. ĐIỀU KHOẢN CHUNG</h2>
          <p className={cx('text_p')}>
            Bằng cách truy cập hoặc sử dụng trang web InternConnect, các dịch vụ
            hoặc bất kỳ ứng dụng nào do ISC cung cấp (gọi chung là "Dịch vụ"),
            dù truy cập bằng cách nào, bạn đồng ý chịu sự ràng buộc của các điều
            khoản sử dụng này ("Điều khoản sử dụng"). Dịch vụ do ISC sở hữu hoặc
            kiểm soát. Các Điều khoản sử dụng này ảnh hưởng đến quyền và nghĩa
            vụ pháp lý của bạn. Nếu bạn không đồng ý chịu sự ràng buộc của tất
            cả các Điều khoản sử dụng này, bạn không truy cập hay sử dụng Dịch
            vụ. Nếu Bạn có bất kỳ câu hỏi nào liên quan đến Điều Khoản này, vui
            lòng liên hệ chúng tôi tại email: hptservices.group@gmail.com.
          </p>
          <p className={cx('text_p')}>
            Chúng tôi có thể cập nhật Điều Khoản này theo thời gian vì các lý do
            pháp lý hoặc theo quy định hoặc để cho phép hoạt động thích hợp của
            trang web InternConnect. Mọi thay đổi sẽ được thông báo tới bạn bằng
            một thông báo phù hợp trên trang web của chúng tôi. Những thay đổi
            này sẽ áp dụng cho việc sử dụng trang web InternConnect. Sau khi
            chúng tôi đã thông báo đến bạn, Nếu bạn không muốn chấp nhận Điều
            Khoản mới, bạn không nên tiếp tục sử dụng trang web InternConnect.
            Nếu bạn tiếp tục sử dụng trang web InternConnect kể từ ngày sự thay
            đổi có hiệu lực, việc sử dụng trang web InternConnect thể hiện bạn
            đồng ý bị ràng buộc bởi Điều Khoản mới.
          </p>
        </div>
        <div className={cx("paragraph")}>
          <h2 className={cx("text")}>II. ĐỊNH NGHĨA VÀ GIẢI THÍCH</h2>
          <p className={cx('text_p')}>
            "Các cơ sở dữ liệu ISC" bao gồm tất cả các bài quảng cáo việc làm
            đăng trên các trang web InternConnect và/hoặc tất cả thông tin của
            các ứng viên và/hoặc các nhà tuyển dụng được đăng ký với ISC.
          </p>
          <p className={cx('text_p')}>
            "Cơ sở dữ liệu Hồ sơ ISC" hoặc "Các cơ sở dữ liệu Hồ sơ" là hồ sơ
            ứng viên được khởi tạo và/hoặc được đăng tại các cơ sở dữ liệu ISC.
          </p>
          <p className={cx('text_p')}>
            "Dịch vụ InternConnect" là bất kỳ dịch vụ nào được cung cấp bởi ISC.
          </p>
          <p className={cx('text_p')}>
            "Hồ sơ cá nhân" là các thông tin, CV cá nhân được tạo bởi Người
            dùng.
          </p>
          <p className={cx('text_p')}>
            "Văn bản" bao gồm tất cả văn bản trên mọi trang của trang web
            InternConnect, cho dù là tài liệu có xác định tác giả, các nội dung
            tìm kiếm có định hướng hay thông tin hướng dẫn.
          </p>
          <p className={cx('text_p')}>
            "Người dùng" đề cập đến bất kỳ cá nhân hoặc tổ chức nào sử dụng bất
            kỳ khía cạnh nào của trang web InternConnect và/hoặc các Dịch vụ
            InternConnect.
          </p>
          <p className={cx('text_p')}>
            "Nội dung Người dùng" là tất cả thông tin, dữ liệu, văn bản, phần
            mềm, âm nhạc, âm thanh, hình ảnh, đồ họa, video, quảng cáo, tin nhắn
            hoặc các tài liệu khác được gửi, đăng hoặc biểu thị bởi Người dùng
            trên hoặc thông qua trang web InternConnect
          </p>
        </div>
        <div className={cx("paragraph")}>
          <h2 className={cx("text")}>III. ĐĂNG KÝ</h2>
          <p className={cx('text_p')}>
            Để sử dụng Dịch vụ bạn phải tạo một tài khoản theo yêu cầu của ISC,
            bạn cam kết rằng việc sử dụng tài khoản phải tuân thủ các quy định
            của ISC, đồng thời tất cả các thông tin bạn cung cấp cho chúng tôi
            là đúng, chính xác, đầy đủ với tại thời điểm được yêu cầu. Mọi quyền
            lợi và nghĩa vụ của bạn sẽ căn cứ trên thông tin tài khoản bạn đã
            đăng ký, do đó nếu có bất kỳ thông tin sai lệch nào chúng tôi sẽ
            không chịu trách nhiệm trong trường hợp thông tin đó làm ảnh hưởng
            hoặc hạn chế quyền lợi của bạn.
          </p>
        </div>
        <div className={cx("paragraph")}>
          <h2 className={cx("text")}>IV. MẬT KHẨU VÀ BẢO MẬT</h2>
          <p className={cx('text_p')}>
            Khi bạn đăng ký sử dụng bất kỳ dịch vụ nào thuộc trang web
            InternConnect bạn sẽ được yêu cầu khởi tạo mật khẩu. Để tránh việc
            gian lận, bạn phải giữ mật khẩu này bảo mật và không được tiết lộ
            hoặc chia sẻ với bất kỳ người nào. Nếu bạn biết hoặc nghi ngờ người
            khác biết mật khẩu của bạn, bạn nên thông báo với chúng tôi ngay lập
            tức bằng cách liên hệ với chúng tôi tại email
            hptservices.group@gmail.com.
          </p>
          <p className={cx('text_p')}>
            Nếu ISC có lý do để tin rằng có khả năng có hành vi vi phạm bảo mật
            hoặc sử dụng không đúng mục đích trang web InternConnect, chúng tôi
            có thể yêu cầu bạn thay đổi mật khẩu hoặc chúng tôi có thể tạm dừng
            tài khoản của bạn.
          </p>
          <p className={cx('text_p')}>
            Trường hợp bạn mất Mật khẩu hoặc hoặc sử dụng không đúng mục đích
            trang web InternConnect bạn phải chịu tất cả sự mất mát hoặc thiệt
            hại phát sinh và chịu trách nhiệm bồi thường hoàn toàn cho ISC trong
            trường hợp ISC có xảy ra mất mát hoặc thiệt hại.
          </p>
        </div>
        <div className={cx("paragraph")}>
          <h2 className={cx("text")}>
            V. QUYỀN TRUY CẬP VÀ THU THẬP THÔNG TIN
          </h2>
          <ol className={cx("main-li")}>
            <li className={cx('text-li')}>
              Khi sử dụng trang web InternConnect, bạn thừa nhận rằng chúng tôi
              có quyền thu thập các thông tin sau của bạn
              <ul className={cx("sub-li")}>
                <li className={cx('text-li')}>
                  Thông tin cá nhân: bao gồm các thông tin bạn cung cấp cho
                  chúng tôi để tạo hồ sơ như tên, số điện thoại, địa chỉ email;…
                </li>
                <li className={cx('text-li')}>
                  Thông tin chung: như các thông tin về kinh nghiệm làm việc,
                  định hướng nghề nghiệp, mục tiêu công việc; trình độ năng lực;
                  thu nhập;…
                </li>
              </ul>
            </li>
            <li className={cx('text-li')}>
              Bạn thừa nhận và đồng ý một mình chịu trách nhiệm về hình thức,
              nội dung và tính xác thực của bất kỳ hồ sơ hoăc tài liệu nào do
              bạn đăng tải trên trang web InternConnect, đồng thời đồng ý một
              mình chịu trách nhiệm cho bất kỳ hệ quả nào phát sinh từ việc đăng
              tải này.
            </li>
            <li className={cx('text-li')}>
              ISC có quyền đề xuất đến bạn dịch vụ và sản phẩm của bên thứ ba
              dựa trên các mục phù hợp mà bạn xác định trong khi đăng ký và bất
              kỳ lúc nào sau đó hoặc khi bạn đã đồng ý tiếp nhận, các đề xuất
              này sẽ được thực hiện bởi ISC hoặc các bên thứ ba.
            </li>
            <li className={cx('text-li')}>
              ISC được quyền tùy ý tuân theo các yêu cầu pháp lý, các yêu cầu từ
              cơ quan thi hành án hoặc yêu cầu của cơ quan quản lý, thậm chí sự
              tuân thủ này có thể bao gồm việc công bố một số thông tin Người
              dùng nhất định. Ngoài ra, bên thứ ba được phép giữ lại các bản sao
              lưu trữ thông tin Người dùng.
            </li>
            <li className={cx('text-li')}>
              Bạn hiểu và thừa nhận rằng tất cả các thông tin do bạn cung cấp,
              Thông tin cá nhân, hồ sơ và/hoặc thông tin tài khoản của bạn, sẽ
              được công bố cho các Nhà tuyển dụng tiềm năng trên ISC.
            </li>
            <li className={cx('text-li')}>
              ISC tôn trọng tuyệt đối quyền bảo mật thông tin của ứng viên. Nếu
              không muốn hồ sơ cá nhân của mình được công khai, bạn vui lòng tắt
              tính năng tìm việc & tính năng cho phép nhà tuyển dụng xem hồ sơ
              để tránh bị làm phiền.
            </li>
            <li className={cx('text-li')}>
              Bạn hiểu và thừa nhận rằng bạn không có các quyền sở hữu trong tài
              khoản của bạn và nếu bạn hủy bỏ tài khoản trên trang web
              InternConnect hoặc tài khoản của bạn bị chấm dứt, tất cả các thông
              tin tài khoản của bạn tại trang web InternConnect, bao gồm sơ yếu
              lý lịch, Thông tin cá nhân, thư xin việc, các công việc đã lưu, sẽ
              được đánh dấu là bị xóa và có thể bị xóa khỏi Cơ sở dữ liệu ISC và
              sẽ được gỡ bỏ từ bất kỳ khu vực chung nào trên trang web
              InternConnect. Thông tin có thể tiếp tục được hiển thị trong một
              khoảng thời gian vì các trở ngại trong khi truyền tín hiệu xóa
              thông qua các máy chủ của InternConnect hoặc do yêu cầu của các cơ
              quan chức năng liên quan. Ngoài ra, các bên thứ ba được phép giữ
              lại bản sao thông tin của bạn.
            </li>
            <li className={cx('text-li')}>
              ISC có quyền xỏa tài khoản và tất cả thông tin của bạn sau một
              thời gian dài không hoạt động.
            </li>
          </ol>
        </div>
        <div className={cx("paragraph")}>
          <h2 className={cx("text")}>VI. TUYÊN BỐ VỀ QUYỀN SỞ HỮU TRÍ TUỆ</h2>
          <ol className={cx("main-li")}>
            <li className={cx('text-li')}>
              Bạn tuyên bố và đảm bảo rằng: (i) bạn sở hữu Nội dung mà bạn đăng
              lên hoặc thông qua Dịch vụ hay nói cách khác, bạn có quyền cấp các
              quyền và giấy phép được quy định trong các Điều khoản sử dụng này;
              (ii) việc đăng và sử dụng Nội dung trên hoặc thông qua Dịch vụ
              không vi phạm, chiếm đoạt hay xâm phạm các quyền của bất kỳ bên
              thứ ba nào, bao gồm nhưng không giới hạn ở quyền riêng tư, quyền
              công khai, bản quyền, nhãn hiệu thương mại và/hoặc quyền sở hữu
              trí tuệ khác; (iii) bạn đồng ý thanh toán tất cả tiền bản quyền
              tác giả, phí và bất kỳ khoản tiền nào khác còn nợ do Nội dung mà
              bạn đăng lên hoặc thông qua Dịch vụ; và (iv) bạn có quyền và năng
              lực pháp lý để tham gia vào các Điều khoản sử dụng này trong quyền
              hạn của bạn.
            </li>
            <li className={cx('text-li')}>
              Logo và tên ISC là các nhãn hiệu thương mại của ISC và không được
              sao chép, giả mạo hay sử dụng toàn bộ hoặc một phần khi chưa có sự
              cho phép trước bằng văn bản của ISC. Ngoài ra, tất cả các tiêu đề
              trang, đồ họa tùy chỉnh, biểu tượng nút và tập lệnh đều là nhãn
              hiệu dịch vụ, nhãn hiệu thương mại và/hoặc bao bì thương mại của
              ISC và không được sao chép, giả mạo hay sử dụng toàn bộ hoặc một
              phần khi chưa có sự cho phép trước bằng văn bản của ISC.
            </li>
            <li className={cx('text-li')}>
              Mặc dù mục đích của ISC là cung cấp Dịch vụ nhiều nhất có thể
              nhưng sẽ có trường hợp Dịch vụ có thể bị gián đoạn, bao gồm nhưng
              không giới hạn ở việc gián đoạn để bảo trì hoặc nâng cấp theo lịch
              trình, để sửa chữa khẩn cấp hay do lỗi của thiết bị và/hoặc liên
              kết viễn thông. Ngoài ra, ISC có quyền xóa bất kỳ Nội dung nào
              khỏi Dịch vụ vì bất kỳ lý do gì mà theo nhận định của mình, là vi
              phạm Điều Khoản này, vi phạm pháp luật, quy tắc hoặc quy định, có
              tính chất lăng mạ, gây rối, xúc phạm hoặc bất hợp pháp, hoặc vi
              phạm các quyền, hoặc nguy hại hoặc đe dọa sự an toàn của Người
              dủng của bất kỳ trang web nào thuộc InternConnect. ISC có quyền
              trục xuất người dùng và ngăn chặn quyền truy cập sau đó của họ tới
              trang web InternConnect và/hoặc sử dụng các dịch vụ ISC khi vi
              phạm Điều Khoản này hoặc vi phạm pháp luật, quy tắc hoặc quy định.
              ISC được phép thực hiện bất kỳ hành động nào liên quan đến Nội
              dung Người dùng khi tự xét thấy cần thiết hoặc thích hợp nếu ISC
              tin rằng Nội dung Người dùng có thể tạo ra trách nhiệm pháp lý cho
              ISC, gây thiệt hại đến thương hiệu ISC hoặc hình ảnh công cộng,
              hoặc dẫn đến việc ISC để mất người dùng. Nội dung bị xóa khỏi Dịch
              vụ có thể tiếp tục được ISC lưu trữ, bao gồm nhưng không giới hạn
              ở việc lưu trữ để tuân thủ một số nghĩa vụ pháp lý nhất định nhưng
              có thể không truy xuất được nếu không có lệnh hợp lệ của tòa án.
              ISC sẽ không chịu trách nhiệm pháp lý với bạn về bất kỳ sửa đổi,
              tạm ngừng hay gián đoạn Dịch vụ nào hoặc việc mất mát bất kỳ Nội
              dung nào. Bạn cũng xác nhận rằng Internet có thể không an toàn và
              rằng việc gửi Nội dung hoặc thông tin khác có thể không an toàn.
            </li>
            <li className={cx('text-li')}>
              ISC sẽ không chịu trách nhiệm với bất cứ thông tin đăng tải của
              bên thứ ba nào, cho dù với lý do nào, do bất cứ tổ chức nào đăng
              tải nội dung trên ISC. Tuy nhiên, ISC sẽ cố gắng sử dụng mọi biện
              pháp kiểm soát và hạn chế tối đa các trường hợp tin tuyển dụng lừa
              đảo, thông tin không đúng….để bảo vệ Người Dùng. ISC không đại
              diện hoặc đảm bảo tính trung thực, chính xác, hoặc độ tin cậy của
              Nội dung Người dùng, các sản phẩm phái sinh từ Nội dung Người
              dùng, hoặc bất kỳ thông tin liên lạc khác được đăng bởi Người dùng
              cũng như không xác nhận bất kỳ ý kiến nào được thể hiện bởi Người
              dùng. Bạn thừa nhận rằng việc tin tưởng nào vào tài liệu được đăng
              bởi Người dùng khác là rủi ro của riêng bạn.
            </li>
          </ol>
        </div>
        <div className={cx("paragraph")}>
          <h2 className={cx("text")}>VII. GIỚI HẠN TRÁCH NHIỆM PHÁP LÝ</h2>
          <p>
            Trong mọi tình huống, ISC sẽ không chịu trách nhiệm pháp lý với bạn
            về bất kỳ mất mát hay thiệt hại nào dưới mọi hình thức (bao gồm
            nhưng không giới hạn ở bất kỳ mất mát hay thiệt hại trực tiếp, gián
            tiếp, kinh tế, cảnh báo, đặc biệt, do trừng phạt, ngẫu nhiên hoặc do
            hậu quả nào) có liên quan trực tiếp hoặc gián tiếp đến: (a) dịch vụ;
            (b) nội dung ISC; (c) nội dung người dùng; (d) việc bạn sử dụng,
            không thể sử dụng hoặc hiệu quả của dịch vụ; (e) mọi hành động được
            thực hiện có liên quan đến việc điều tra của ISC hoặc cơ quan thực
            thi pháp luật về việc sử dụng dịch vụ của bạn hoặc bất kỳ bên nào
            khác; (f) bất kỳ hành động nào được thực hiện có liên quan đến chủ
            sở hữu bản quyền hoặc quyền sở hữu trí tuệ khác; (g) mọi lỗi hoặc
            thiếu sót trong hoạt động của dịch vụ; hoặc (h) mọi thiệt hại đối
            với mọi máy tính, thiết bị di động, thiết bị hoặc công nghệ khác của
            người dùng, bao gồm nhưng không giới hạn ở thiệt hại do bất kỳ hành
            vi vi phạm bảo mật nào hoặc do bất kỳ vi-rút, lỗi, giả mạo, gian
            lận, lỗi, thiếu sót, gián đoạn, khiếm khuyết, trì hoãn quá trình
            hoạt động hoặc truyền đi, lỗi mạng hay dòng máy tính, mọi sự cố kỹ
            thuật khác hoặc trục trặc khác, bao gồm nhưng không giới hạn ở thiệt
            hại do mất lợi nhuận, mất tín nhiệm, mất dữ liệu, ngừng việc, độ
            chính xác của kết quả hoặc lỗi hay trục trặc máy tính, ngay cả khi
            có thể dự đoán được hoặc ISC đã được thông báo hay lẽ ra phải biết
            về khả năng xảy ra các thiệt hại đó, cho dù theo hợp đồng, do sơ ý,
            trách nhiệm pháp lý nghiêm ngặt hoặc sai lầm cá nhân (bao gồm, nhưng
            không giới hạn ở nguyên nhân một phần hoặc toàn bộ do sơ ý, thiên
            tai, lỗi viễn thông, lấy cắp hay hủy hoại dịch vụ). Trong mọi trường
            hợp, ISC không chịu trách nhiệm pháp lý với bạn hoặc bất kỳ ai khác
            về mất mát, thiệt hại hoặc thương tích, bao gồm nhưng không giới hạn
            ở thương tích cá nhân hoặc tử vong.
          </p>
        </div>
        <div className={cx("paragraph")}>
          <h2 className={cx("text")}>VIII. HIỆU LỰC THỎA THUẬN CỦA HỢP ĐỒNG</h2>
          <ol className={cx("main-li")}>
            <li className={cx('text-li')}>
              Các điều khoản quy định tại Quy định sử dụng này có thể được cập
              nhật, chỉnh sửa bất cứ lúc nào mà không cần phải thông báo trước
              tới người sử dụng. ISC sẽ công bố rõ trên Website, về những thay
              đổi, bổ sung đó.
            </li>
            <li className={cx('text-li')}>
              Trong trường hợp một hoặc một số điều khoản Quy định sử dụng này
              xung đột với các quy định của luật pháp và bị Tòa án tuyên là vô
              hiệu, điều khoản đó sẽ được chỉnh sửa cho phù hợp với quy định
              pháp luật hiện hành, và phần còn lại của Quy định sử dụng vẫn giữ
              nguyên giá trị.
            </li>
            <li className={cx('text-li')}>
              Thỏa thuận này có giá trị như Hợp Đồng. Người Dùng hiểu rằng, đây
              là hợp đồng điện tử, Giá trị pháp lý của hợp đồng điện tử không
              thể bị phủ nhận chỉ vì hợp đồng đó được thể hiện dưới dạng thông
              điệp dữ liệu theo Pháp Luật về Giao Dịch Điện Tử. Bằng cách nhấn
              vào nút “Tôi đồng ý”, Người Dùng hoàn toàn đồng ý và đã hiểu các
              điều khoản trong Hợp Đồng này và Hợp Đồng có hiệu lực kề từ thời
              điểm này. Nếu vi phạm các Điều khoản này, bạn đồng ý chịu hoàn
              toàn trách nhiệm và bồi thường thiệt hại (Nếu có) với ISC.
            </li>
          </ol>
        </div>
        <div className={cx("paragraph")}>
          <h2 className={cx("text")}>THÔNG TIN LIÊN LẠC</h2>
          <p className={cx('text_p')}>
            Nếu bạn có câu hỏi về Điều khoản sử dụng này, vui lòng gửi email tới
            địa chỉ hptservices.group@gmail.com để được giải đáp nhanh nhất.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermOfServices;
