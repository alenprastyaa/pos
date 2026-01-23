import{j as Me,r as l,c as L,y as Ee,o as He,b as c,a as Ae,w as Re,d as a,p as ee,v as ie,u as qe,e as m,F as V,h as O,q as S,z as Ke,n as D,t as o,f as te,B as Fe,x as re,i as Le,A as U}from"./index-qOie7hwJ.js";import{a as K,S as r}from"./sweetalert2.esm.all-BgBW3QO9.js";import{_ as Ve}from"./AdminLayout-Cc7Y9ATg.js";import{_ as Oe}from"./_plugin-vue_export-helper-DlAUqK2U.js";const Ue={class:"page-container min-h-screen py-2 space-y-2"},Ge={class:"grid grid-cols-1 lg:grid-cols-3 gap-4"},Ye={class:"lg:col-span-2 relative"},Je=["disabled"],Qe={key:0,class:"dropdown-container absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl z-10 max-h-200 overflow-y-auto"},We=["onClick"],Xe={style:{"font-size":"12px"},class:"dropdown-text"},Ze={class:"font-semibold"},et={class:"text-green-600 font-medium"},tt={key:0,disabled:""},at=["value"],nt={key:0,class:"card-section p-4 rounded-lg border"},st={class:"flex justify-between items-center"},lt={key:1,class:"space-y-3"},ot={class:"flex items-center gap-2"},it={class:"text-sm font-bold text-title"},rt={class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"},dt={class:"mb-3"},ut={class:"text-sm font-semibold text-title"},ct={class:"text-lg font-bold text-warning mt-1"},pt={class:"text-xs text-muted mt-2"},mt={class:"flex gap-2 justify-end"},gt=["onClick"],ft=["onClick"],vt={class:"card-section rounded-lg shadow-sm border overflow-hidden"},bt={class:"overflow-x-auto"},ht={class:"w-full"},xt={class:"divide-y divide-border"},yt={key:0},kt={class:"px-6 py-1 text-sm text-body font-medium"},_t={class:"px-6 py-1"},wt={style:{"font-size":"12px"},class:"text-body leading-tight"},Tt={class:"px-6 py-1 text-center"},Bt=["onUpdate:modelValue","onChange"],jt={class:"px-6 py-1 text-right text-sm text-muted-dark"},Pt={class:"px-6 py-1 text-right text-sm font-semibold text-body"},Ct={class:"px-6 py-1 text-center"},$t=["onClick"],It={class:"px-6 py-2 bg-footer border-t flex justify-between items-center"},St={class:"text-xl text-primary"},Dt={class:"space-y-4 mt-4"},zt={class:"relative"},Nt=["value"],Mt={class:"card-section p-5 border rounded-lg space-y-3"},Et={class:"flex justify-between text-sm"},Ht={class:"flex justify-between text-sm"},At={class:"font-semibold text-body"},Rt={class:"flex justify-between text-sm border-t pt-3 border-divider"},qt={class:"font-semibold text-body"},Kt={class:"grid grid-cols-1 md:grid-cols-3 gap-4"},Ft=["disabled"],Lt={key:0,class:"animate-spin h-5 w-5",fill:"none",viewBox:"0 0 24 24"},Vt=["disabled"],de="pendingTransactions",Ot=Me({__name:"PenjualanGrosir",setup(Ut){const ue=Le(),z="https://alentest.my.id/pos",k=l(0),ce=localStorage.getItem("role_name"),f=l(-1),G=l([]),Y=l(!1),N=l(!1),p=l(""),g=l(0),pe=l(""),F=l(null),d=l([]),x=l([]),B=l(null),j=l(null),M=l(""),v=l([]),_=l(!1),E=()=>({Authorization:`Bearer ${localStorage.getItem("authToken")}`}),me=L(()=>{var e;return((e=j.value)==null?void 0:e.role_name)==="superadmin"});l([]);const ge=l("");l(!1);const H=l(""),J=L(()=>{const e=Number(k.value)||0,t=Number(w.value)||0;return e+t}),ae=l(null),Q=l(null),fe=e=>{/\d/.test(e.key)&&e.preventDefault()},ve=e=>{const t=e.replace(/\D/g,""),n=parseInt(t)||0;g.value=n,t===""?H.value="":H.value=new Intl.NumberFormat("id-ID").format(n)},be=e=>{const t=e.target;ve(t.value)},he=e=>{const t=e.target;g.value>0&&(t.value=g.value.toString())},xe=e=>{const t=e.target;g.value>0&&(t.value=H.value)},ye=e=>{e.key==="Enter"&&(e.preventDefault(),U(()=>{var t,n;(t=Q.value)==null||t.focus(),(n=Q.value)==null||n.click()}))},ke=async e=>{if(!e.trim()){v.value=[],_.value=!1;return}try{const t=await K.get(`${z}/produk`,{params:{search:e},headers:E()});t.data.success&&t.data.data.data&&(v.value=t.data.data.data.map(n=>({barcode:n.barcode,qty:1,nama_produk:n.nama_produk,harga_jual_ritel:parseFloat(n.harga_jual_ritel)})),_.value=!0,f.value=-1)}catch(t){console.error("Error searching products:",t),v.value=[]}},_e=e=>{if(!(!_.value||v.value.length===0))switch(e.key){case"ArrowDown":e.preventDefault(),f.value=Math.min(f.value+1,v.value.length-1);break;case"ArrowUp":e.preventDefault(),f.value=Math.max(f.value-1,-1);break;case"Enter":e.preventDefault(),f.value>=0&&ne(v.value[f.value]);break;case"Escape":e.preventDefault(),_.value=!1,f.value=-1;break}},ne=async e=>{const t=await Ne(e);t!==null&&(je(e,t),r.fire({icon:"success",title:"Berhasil",text:`${t} ${e.nama_produk} ditambahkan`,timer:1500,showConfirmButton:!1})),M.value="",v.value=[],_.value=!1,f.value=-1,U(()=>{var n;(n=F.value)==null||n.focus()})},i=e=>e==null||isNaN(e)?"Rp 0":new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(e),we=e=>new Date(e).toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),w=L(()=>d.value.reduce((e,t)=>e+t.qty*t.harga_jual_ritel,0)),P=L(()=>{const e=Number(g.value)||0,t=Number(J.value)||0;return e-t}),Te=async()=>{try{const e=await K.get(`${z}/user/my/data`,{headers:E()});e.data.success&&(j.value={full_name:e.data.data.full_name,role_name:e.data.data.role_name,toko:{id:e.data.data.toko.id,nama_toko:e.data.data.toko.nama_toko,alamat:e.data.data.toko.alamat}})}catch(e){console.error("Gagal mengambil data kasir:",e)}},se=async e=>{try{const t=await K.get(`${z}/pelanggan/${e}`,{headers:E()});t.data.success&&t.data.data&&(k.value=Number(t.data.data.hutang)||0)}catch(t){console.error("Gagal mengambil hutang pelanggan:",t),k.value=0}};Ee(p,async e=>{e?(await se(e),U(()=>{var t;(t=ae.value)==null||t.focus()})):k.value=0});const Be=async()=>{Y.value=!0;try{const e=await K.get(`${z}/pelanggan`,{headers:E()});e.data.success&&(G.value=e.data.data)}catch(e){console.error("Gagal mengambil data pelanggan:",e)}finally{Y.value=!1}},W=()=>{p.value="",g.value=0,H.value="",d.value=[],pe.value="",B.value=null,U(()=>{var e;(e=F.value)==null||e.focus(),M.value="",v.value=[],_.value=!1})},je=(e,t=1)=>{const n=d.value.find(s=>s.barcode===e.barcode);n?(n.qty+=t,d.value=[n,...d.value.filter(s=>s.barcode!==e.barcode)]):d.value.unshift({barcode:e.barcode,qty:t,nama_produk:e.nama_produk,harga_jual_ritel:parseFloat(e.harga_jual_ritel)})},Pe=(e,t)=>{const n=d.value.find(s=>s.barcode===e);n&&(t<=0||isNaN(t)?le(e):n.qty=t)},le=e=>{d.value=d.value.filter(t=>t.barcode!==e)},oe=()=>{try{localStorage.setItem(de,JSON.stringify(x.value))}catch(e){console.error("Error saving pending transactions:",e)}},Ce=()=>{try{const e=localStorage.getItem(de);x.value=e?JSON.parse(e):[]}catch(e){console.error("Error loading pending transactions:",e),x.value=[]}},$e=async()=>{if(d.value.length===0){r.fire("Peringatan","Keranjang belanja kosong.","warning");return}if(!p.value){r.fire("Peringatan","Pelanggan harus dipilih untuk menyimpan transaksi pending.","warning");return}const e=G.value.find(s=>s.id===p.value),t=e?e.nama_pelanggan:"Pelanggan Tidak Dikenal",n={id:Date.now(),pelanggan_id:p.value,nama_pelanggan:t,items:[...d.value],tanggal_simpan:new Date().toLocaleString("id-ID"),total:w.value};x.value.push(n),oe(),r.fire("Berhasil","Transaksi telah disimpan sebagai pending.","success"),W()},Ie=e=>{W(),p.value=e.pelanggan_id,d.value=e.items,g.value=0,B.value=e.id,r.fire("Dimuat",`Transaksi untuk ${e.nama_pelanggan} telah dimuat ke keranjang.`,"info"),X(B.value,!1)},X=(e,t=!0)=>{x.value=x.value.filter(n=>n.id!==e),oe(),t&&r.fire("Berhasil","Transaksi pending telah dihapus.","success")},Se=(e,t,n,s,b,C)=>{const $=e.total_bayar,u=e.total_harga,T=e.total_kembalian,I=e.sisa_hutang,y=h=>new Intl.NumberFormat("id-ID",{minimumFractionDigits:0}).format(h);return`
        <div style="width: 100%; font-family: Arial, Helvetica, sans-serif; font-size: 11px; padding: 0 2px;">
            <div style="text-align: center; margin-bottom: 10px;">
                <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">${b.toUpperCase()}</div>
                <div style="font-size: 10px; line-height: 1.2;">
                    ${C.replace(/\n/g,"<br>")}
                </div>
            </div>

            <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 5px 0; margin: 5px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 10px;">
                    <span>ID: ${e.id.substring(0,8)}</span>
                    <span>Kasir: ${s}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 10px;">
                    <span>Tgl: ${we(e.createdAt)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 10px;">
                    <span>Plg: ${t}</span>
                </div>
            </div>

            <div style="display: flex; font-weight: bold; font-size: 10px; margin-bottom: 5px; border-bottom: 1px solid #000; padding-bottom: 2px;">
                <span style="flex: 1; text-align: left;">ITEM</span>
                <span style="width: 25px; text-align: center;">Qty</span>
                <span style="width: 55px; text-align: right;">Harga</span>
                <span style="width: 60px; text-align: right;">Total</span>
            </div>

            <div style="margin-bottom: 8px;">
                ${n.map(h=>`
                    <div style="display: flex; font-size: 10px; margin-bottom: 4px;">
                        <span style="flex: 1; text-align: left; overflow-wrap: break-word; padding-right: 2px;">
                            ${h.nama_produk}
                        </span>
                        <span style="width: 25px; text-align: center; vertical-align: top;">${h.qty}</span>
                        <span style="width: 55px; text-align: right; vertical-align: top;">${y(h.harga_jual_ritel)}</span>
                        <span style="width: 60px; text-align: right; vertical-align: top;">${y(h.qty*h.harga_jual_ritel)}</span>
                    </div>
                `).join("")}
            </div>

            <div style="border-top: 1px dashed #000; padding-top: 5px;">
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 12px; margin-bottom: 2px;">
                    <span>TOTAL:</span>
                    <span>Rp ${y(u)}</span>
                </div>

                <div style="display: flex; justify-content: space-between; font-size: 11px;">
                    <span>Tunai:</span>
                    <span>Rp ${y($)}</span>
                </div>
                
                ${T>0?`
                    <div style="display: flex; justify-content: space-between; font-size: 11px;">
                        <span>Kembali:</span>
                        <span>Rp ${y(T)}</span>
                    </div>
                `:""}

                ${I>0?`
                    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; margin-top: 5px;">
                        <span>SISA HUTANG:</span>
                        <span>Rp ${y(I)}</span>
                    </div>
                `:""}
            </div>

            <div style="margin-top: 15px; text-align: center; font-size: 10px;">
                <div>Terima Kasih</div>
                <div>Barang yang dibeli tidak dapat ditukar/dikembalikan</div>
            </div>
        </div>
    `},De=(e,t,n,s,b,C)=>{const $=Se(e,t,n,s,b,C),u=window.open("","","width=400,height=600");if(!u){r.fire("Error","Gagal membuka jendela cetak. Periksa setelan pop-up browser Anda.","error");return}u.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Struk #${e.id.substring(0,8)}</title>
                <style>
                    /* Reset CSS dasar */
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    
                    body { 
                        font-family: Arial, Helvetica, sans-serif; /* Font biasa yang lebih jelas */
                        background: #fff;
                        color: #000;
                    }

                    /* PENTING: Pengaturan khusus saat Print */
                    @media print {
                        @page {
                            margin: 0; /* Menghapus margin default browser agar tidak terpotong */
                            size: auto; /* Membiarkan printer menentukan ukuran kertas */
                        }
                        
                        body {
                            padding: 5px 5px 5px 5px; /* Sedikit padding agar tidak mepet tepi kertas */
                            width: 100%;
                        }
                        
                        /* Sembunyikan header/footer browser jika memungkinkan */
                        html, body {
                            height: auto;
                        }
                    }
                </style>
            </head>
            <body onload="window.print(); setTimeout(() => window.close(), 1000);">
                ${$}
            </body>
        </html>
    `),u.document.close()},ze=async()=>{var C,$;if(!p.value){r.fire("Peringatan","Pelanggan harus dipilih.","warning");return}if(d.value.length===0){r.fire("Peringatan","Keranjang belanja kosong.","warning");return}if(!j.value){r.fire("Error","Data kasir/toko belum dimuat. Mohon refresh halaman atau cek koneksi API.","error");return}if(me.value&&!ge.value){r.fire("Peringatan","Toko harus dipilih untuk melakukan penjualan.","warning");return}if(!(await r.fire({icon:"question",title:"Konfirmasi Transaksi",html:`<div class="text-left">
                   <p class="mb-3"><strong>Total Belanja:</strong> ${i(w.value)}</p>
                   <p class="mb-3"><strong>Uang Bayar:</strong> ${i(g.value)}</p>
                   <p class="mb-4"><strong>Kembalian/Hutang:</strong> <span class="${P.value<0?"text-red-600 font-bold ":"text-green-600 font-bold"}">${i(Math.abs(P.value))}</span></p>
                   <hr class="my-3">
                   <p class="text-sm text-gray-600">Periksa kembali data di atas sebelum melanjutkan.</p>
               </div>`,showCancelButton:!0,confirmButtonText:"Ya, Lanjutkan",cancelButtonText:"Batalkan",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1,allowEscapeKey:!1})).isConfirmed)return;const t=P.value;if(t<0){const u=Math.abs(t);if(!(await r.fire({icon:"warning",title:"Kurang Bayar!",html:`<p>Pembayaran <strong>kurang</strong> sebesar <strong>${i(u)}</strong>.</p>
                   <p class="mt-2 text-red-500 font-semibold">Transaksi ini akan dicatat sebagai <strong>Hutang</strong>.</p>
                   <p class="text-sm mt-3">Lanjutkan proses transaksi?</p>`,showCancelButton:!0,confirmButtonText:"Ya, Catat Hutang",cancelButtonText:"Batalkan Transaksi",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1,allowEscapeKey:!1})).isConfirmed)return}const n=[...d.value],s=d.value.map(u=>({barcode:u.barcode,qty:u.qty})),b={pelanggan_id:p.value,pembayaran:g.value,items:s};N.value=!0;try{const u=await K.post(`${z}/transaksi/create/ritel`,b,{headers:E()});if(u.data.success){const T=u.data.data.transaksi,I=T.sisa_hutang||0,y=T.total_kembalian||0,h=u.data.data.pelanggan.nama_pelanggan;De(T,h,n,j.value.full_name,j.value.toko.nama_toko,j.value.toko.alamat);let A,R,q;I>0?(q="warning",A="Transaksi Tercatat sebagai Hutang!",R=`<p class="text-lg font-bold mt-2">Pelanggan: ${h}</p>
                   <p class="text-xl font-bold mt-1 text-red-600">Sisa Hutang: ${i(I)}</p>`):I===0?(y>0?(q="success",A="Transaksi Berhasil!",R=`<p class="text-lg font-bold mt-2">Total Belanja: ${i(w.value)}</p>
                       <p class="text-lg font-bold mt-1">Uang Bayar: ${i(g.value)}</p>
                       <p class="text-xl font-bold mt-2 text-green-600">Kembalian: ${i(y)}</p>`):(q="success",A="Transaksi Berhasil!",R='<p class="text-lg font-bold mt-2">Pembayaran Lunas Pas!</p>'),ue.push("/penjualan-grosir")):(q="error",A="Error Logika Transaksi!",R='<p class="text-lg font-bold mt-2">Terdeteksi error internal. Hubungi Admin.</p>'),r.fire({icon:q,title:A,html:R,confirmButtonText:"OK",confirmButtonColor:"#0891b2",allowOutsideClick:!1,allowEscapeKey:!1,didOpen:()=>{const Z=document.querySelector(".swal2-confirm");Z&&Z.focus()}}).then(Z=>{B.value!==null&&X(B.value,!1),se(p.value),W()})}else r.fire({icon:"error",title:"Transaksi Gagal",text:u.data.message||"Terjadi kesalahan saat memproses transaksi."})}catch(u){console.error("Error transaksi:",u),r.fire({icon:"error",title:"Error",text:(($=(C=u.response)==null?void 0:C.data)==null?void 0:$.message)||"Gagal terhubung ke server."})}finally{N.value=!1}},Ne=async e=>{const t=await r.fire({title:"Jumlah Barang",html:`
            <p class="mb-3 text-gray-700 font-medium">${e.nama_produk}</p>
            <input id="qty-input" type="number" min="1" value="1" 
                class="swal2-input w-full text-center text-lg font-bold text-gray-800" 
                autofocus>
        `,showCancelButton:!0,confirmButtonText:"Tambahkan",cancelButtonText:"Batal",confirmButtonColor:"#0891b2",cancelButtonColor:"#6b7280",allowOutsideClick:!1,didOpen:()=>{const n=document.getElementById("qty-input");n&&(n.focus(),n.select(),n.addEventListener("keydown",s=>{s.key==="Enter"&&(s.preventDefault(),r.clickConfirm())}))},preConfirm:()=>{const n=document.getElementById("qty-input"),s=parseInt(n.value);return!s||s<=0||isNaN(s)?(r.showValidationMessage("Masukkan jumlah yang valid (minimal 1)"),!1):s}});return t.isConfirmed&&t.value?t.value:null};return He(async()=>{var e;await Te(),await Be(),Ce(),(e=F.value)==null||e.focus()}),(e,t)=>(c(),Ae(Ve,null,{default:Re(()=>[a("div",Ue,[a("div",Ge,[a("div",Ye,[t[4]||(t[4]=a("label",{class:"block text-sm font-medium label-text mb-2"}," Cari Produk ",-1)),ee(a("input",{onKeypress:fe,ref_key:"barcodeInputRef",ref:F,"onUpdate:modelValue":t[0]||(t[0]=n=>M.value=n),type:"text",style:{"font-size":"12px"},placeholder:"Ketik nama produk...",onInput:t[1]||(t[1]=n=>ke(M.value)),onKeydown:_e,disabled:qe(ce)!=="admin",class:"input-field w-full h-8 px-4 rounded-lg transition"},null,40,Je),[[ie,M.value]]),_.value&&v.value.length>0?(c(),m("div",Qe,[(c(!0),m(V,null,O(v.value,(n,s)=>(c(),m("div",{key:n.barcode,onClick:b=>ne(n),class:D([s===f.value?"dropdown-item-active":"dropdown-item","px-2 py-1 cursor-pointer last:border-b-0 transition"])},[a("div",Xe,[a("span",Ze,o(n.nama_produk),1),t[3]||(t[3]=a("span",{class:"mx-2"},"|",-1)),a("span",et,o(i(n.harga_jual_ritel)),1)])],10,We))),128))])):S("",!0)]),a("div",null,[t[6]||(t[6]=a("label",{class:"block text-sm font-medium label-text mb-2"}," Pilih Pelanggan ",-1)),ee(a("select",{"onUpdate:modelValue":t[2]||(t[2]=n=>p.value=n),required:"",style:{"font-size":"12px"},class:"input-field w-full h-8 rounded-lg px-4 transition"},[t[5]||(t[5]=a("option",{value:"",disabled:""},"Pilih Pelanggan...",-1)),Y.value?(c(),m("option",tt,"Memuat...")):S("",!0),(c(!0),m(V,null,O(G.value,n=>(c(),m("option",{key:n.id,value:n.id},o(n.nama_pelanggan),9,at))),128))],512),[[Ke,p.value]])])]),p.value?(c(),m("div",nt,[a("div",st,[t[7]||(t[7]=a("span",{class:"text-sm font-medium text-muted"},"Hutang Pelanggan",-1)),a("span",{class:D(["text-lg",k.value>0?"text-danger":"text-success"])},o(i(k.value)),3)])])):S("",!0),x.value.length>0?(c(),m("div",lt,[a("div",ot,[t[8]||(t[8]=a("div",{class:"w-1 h-6 indicator-bar rounded"},null,-1)),a("p",it," Transaksi Pending ("+o(x.value.length)+") ",1)]),a("div",rt,[(c(!0),m(V,null,O(x.value,n=>(c(),m("div",{key:n.id,class:D(["p-4 border-2 rounded-lg transition cursor-pointer pending-card",n.id===B.value?"pending-card-active":"pending-card-inactive"])},[a("div",dt,[a("p",ut,o(n.nama_pelanggan),1),a("p",ct,o(i(n.total)),1),a("p",pt,o(n.tanggal_simpan),1)]),a("div",mt,[a("button",{onClick:s=>Ie(n),class:"btn-primary-small text-sm px-3 py-1.5 rounded-md font-medium transition"}," Muat ",8,gt),a("button",{onClick:s=>X(n.id),class:"btn-secondary-small text-sm px-3 py-1.5 rounded-md font-medium transition"}," Hapus ",8,ft)])],2))),128))])])):S("",!0),a("div",vt,[a("div",bt,[a("table",ht,[t[11]||(t[11]=a("thead",null,[a("tr",{class:"table-header border-b"},[a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-left uppercase tracking-wider th-text"},"No"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-left uppercase tracking-wider th-text"},"Produk"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-center uppercase tracking-wider th-text"},"Qty"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-right uppercase tracking-wider th-text"},"Harga"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-right uppercase tracking-wider th-text"},"Subtotal"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-center uppercase tracking-wider th-text"})])],-1)),a("tbody",xt,[d.value.length===0?(c(),m("tr",yt,t[9]||(t[9]=[a("td",{colspan:"6",class:"px-6 py-12 text-center text-muted-light"},[a("div",{class:"space-y-2"},[a("svg",{class:"w-12 h-12 mx-auto opacity-40",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[a("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.5",d:"M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"})]),a("p",{class:"text-sm"},"Belum ada produk ditambahkan")])],-1)]))):S("",!0),(c(!0),m(V,null,O(d.value,(n,s)=>(c(),m("tr",{key:n.barcode,class:"table-row-hover transition"},[a("td",kt,o(s+1),1),a("td",_t,[a("div",wt,o(n.nama_produk),1)]),a("td",Tt,[ee(a("input",{"onUpdate:modelValue":b=>n.qty=b,type:"number",min:"1",onChange:b=>Pe(n.barcode,n.qty),class:"input-qty w-20 text-center border rounded-md px-2 py-1 text-sm transition"},null,40,Bt),[[ie,n.qty,void 0,{number:!0}]])]),a("td",jt,o(i(n.harga_jual_ritel)),1),a("td",Pt,o(i(n.qty*n.harga_jual_ritel)),1),a("td",Ct,[a("button",{type:"button",onClick:b=>le(n.barcode),class:"btn-icon-delete p-1.5 rounded-md transition"},t[10]||(t[10]=[a("svg",{width:"18",height:"18",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor","stroke-width":"2"},[a("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})],-1)]),8,$t)])]))),128))])])]),a("div",It,[t[12]||(t[12]=a("span",{class:"text-base text-muted-dark"},"Total Belanja",-1)),a("span",St,o(i(w.value)),1)])]),a("div",Dt,[a("div",null,[t[14]||(t[14]=a("label",{class:"block text-sm font-medium label-text mb-2"},[te(" Jumlah Bayar "),a("span",{class:"text-danger"},"*")],-1)),a("div",zt,[t[13]||(t[13]=a("span",{class:"absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted"},"Rp",-1)),a("input",{ref_key:"pembayaranInputRef",ref:ae,value:H.value||g.value||"",onInput:be,onFocus:he,onBlur:xe,onKeydown:Fe(ye,["enter"]),type:"text",required:"",placeholder:"0",class:"input-field w-full h-10 pl-12 pr-4 rounded-lg border text-sm transition"},null,40,Nt)])]),a("div",Mt,[a("div",Et,[t[15]||(t[15]=a("span",{class:"text-muted"},"Hutang Lama:",-1)),a("span",{class:D(["font-semibold",k.value>0?"text-danger":"text-success"])},o(i(k.value)),3)]),a("div",Ht,[t[16]||(t[16]=a("span",{class:"text-muted"},"Total Belanja:",-1)),a("span",At,o(i(w.value)),1)]),a("div",{class:D(["flex justify-between text-base border-t pt-3 border-divider",J.value>0?"text-orange-custom":"text-body"])},[t[17]||(t[17]=a("span",null,"Total yang Harus Dibayar:",-1)),a("span",null,o(i(J.value)),1)],2),a("div",Rt,[t[18]||(t[18]=a("span",{class:"text-muted"},"Uang Bayar:",-1)),a("span",qt,o(i(g.value)),1)]),a("div",{class:D(["flex justify-between text-base border-t pt-3 border-divider",P.value>=0?"text-success":"text-danger"])},[a("span",null,o(P.value>=0?"Kembalian":"Sisa Hutang"),1),a("span",null,o(i(Math.abs(P.value))),1)],2)])]),a("div",Kt,[a("button",{ref_key:"submitButtonRef",ref:Q,type:"submit",onClick:re(ze,["prevent"]),disabled:N.value||w.value===0||!p.value,class:"md:col-span-2 h-12 btn-submit text-base font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition transform hover:scale-[1.01]"},[N.value?(c(),m("svg",Lt,t[19]||(t[19]=[a("circle",{class:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"4"},null,-1),a("path",{class:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"},null,-1)]))):S("",!0),te(" "+o(N.value?"Memproses...":"Proses Transaksi"),1)],8,Ft),a("button",{type:"button",onClick:re($e,["prevent"]),disabled:d.value.length===0||!p.value,class:"btn-pending h-12 font-medium rounded-lg flex items-center justify-center gap-2 transition"},t[20]||(t[20]=[a("svg",{class:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","stroke-width":"2"},[a("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"})],-1),te(" Simpan (Pending) ")]),8,Vt)])])]),_:1}))}}),Wt=Oe(Ot,[["__scopeId","data-v-93cb9e78"]]);export{Wt as default};
